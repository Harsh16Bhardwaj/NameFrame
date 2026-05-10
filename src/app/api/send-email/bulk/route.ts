import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { v2 as cloudinary } from "cloudinary";
import { generateCertificateEmail } from "../emailTemplate";
import { extractPublicId } from 'cloudinary-build-url';
import { generateVerificationCode, generateCertificateHash } from "@/lib/verification";
import { toLegacyTemplateConfig } from "@/lib/certificate/editor-config";

const resend = new Resend(process.env.RESEND_API_KEY);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Email retry configuration
const MAX_RETRIES = 2;
const RETRY_DELAY_BASE = 1000; // Base delay in milliseconds

// Sleep function for delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Send email with retry logic
async function sendEmailWithRetry(
  emailData: any, 
  participant: any, 
  jobId: string,
  attemptNumber: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    const emailResult = await resend.emails.send(emailData);

    if (emailResult.error) {
      throw new Error(emailResult.error.message || "Email API error");
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Email attempt ${attemptNumber} failed for ${participant.email}:`, errorMessage);

    await prisma.deliveryAttempt.create({
      data: {
        participantId: participant.id,
        jobId,
        provider: "RESEND",
        status: "FAILED",
        attemptNo: attemptNumber,
        errorMessage,
      },
    });

    if (attemptNumber < MAX_RETRIES) {
      // Wait before retry with exponential backoff
      const delay = RETRY_DELAY_BASE * Math.pow(2, attemptNumber - 1);
      await sleep(delay);
      
      // Retry
      return sendEmailWithRetry(emailData, participant, jobId, attemptNumber + 1);
    }

    return { success: false, error: errorMessage };
  }
}

export async function POST(req: Request) {
  try {
    const { subject, transcript, eventId } = await req.json();

    if (!subject || !transcript || !eventId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: subject, transcript, or eventId" },
        { status: 400 }
      );
    }

    // Get the event with template
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { template: true },
    });

    if (!event || !event.template) {
      return NextResponse.json(
        { success: false, error: "Event or template not found" },
        { status: 404 }
      );
    }

    const job = await prisma.deliveryJob.create({
      data: {
        eventId,
        provider: "RESEND",
        mode: "BATCH",
        status: "RUNNING",
        startedAt: new Date(),
        batchSize: 10,
      },
    });

    // Extract public ID from template URL
    const templateUrl = event.template.backgroundUrl;
    const publicId = extractPublicId(templateUrl);
    
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "Invalid template URL" },
        { status: 400 }
      );
    }

    // Fetch participants who need emails (not yet successfully sent)
    const participants = await prisma.participant.findMany({
      where: { 
        eventId, 
        emailed: false,
      },
      take: 10, // Process in batches of 10
    });

    if (participants.length === 0) {
      return NextResponse.json(
        { success: true, message: "No participants need email processing" },
        { status: 200 }
      );
    }

    console.log(`Processing ${participants.length} participants for email retry...`);

    const results = {
      successful: 0,
      failed: 0,
      totalProcessed: participants.length
    };

    // Process participants sequentially to avoid overwhelming the email service
    for (const participant of participants) {
      try {
        // Mark as sending
        // Generate verification code if not present
        let verificationCode = participant.verificationCode;
        if (!verificationCode) {
          verificationCode = generateVerificationCode();
        }

        // Generate certificate URL using template settings
        const templateConfig = toLegacyTemplateConfig(event.template.editorConfigJson);
        const certificateUrl = cloudinary.url(publicId, {
          transformation: [
            {
              overlay: {
                font_family: templateConfig.fontFamily,
                font_size: templateConfig.fontSize,
                font_weight: "bold",
                text: participant.name,
              },
              color: templateConfig.fontColor,
              width: templateConfig.textWidth * 11,
              height: templateConfig.textHeight * 9,
              gravity: "center",
              y: Math.round((templateConfig.textPositionY - 50) * 10),
              x: Math.round((templateConfig.textPositionX - 50) * 10),
            },
            // Add verification code as watermark
            ...(verificationCode ? [{
              overlay: {
                font_family: "Arial",
                font_size: 16,
                font_weight: "normal",
                text: `Verification: ${verificationCode}`,
              },
              color: "#666666",
              gravity: "south_east",
              x: 20,
              y: 20,
            }] : []),
          ],
          format: "png",
          quality: "auto:best",
        });

        // Generate certificate hash
        const certificateHash = generateCertificateHash({
          recipientName: participant.name,
          eventTitle: event.title,
          issueDate: new Date().toISOString(),
          verificationCode,
        });

        // Generate email HTML
        const emailHtml = generateCertificateEmail({
          subject,
          eventTitle: event.title,
          participantName: participant.name,
          transcript,
          certificateUrl,
          verificationCode,
        });

        // Prepare email data
        const emailData = {
          from: `${event.title || 'Certificates'} <noreply@${process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL}>`,
          to: [participant.email],
          subject: subject,
          html: emailHtml,
          tags: [
            {
              name: "event_id",
              value: eventId,
            },
          ],
        };

        // Attempt to send email with retry logic
        const emailResult = await sendEmailWithRetry(emailData, participant, job.id);

        if (emailResult.success) {
          // Update participant as successfully emailed
          await prisma.participant.update({
            where: { id: participant.id },
            data: {
              emailed: true,
              certificateUrl,
              verificationCode,
              certificateHash,
            },
          });

          await prisma.deliveryAttempt.create({
            data: {
              participantId: participant.id,
              jobId: job.id,
              provider: "RESEND",
              status: "SENT",
              attemptNo: 1,
              sentAt: new Date(),
            },
          });

          results.successful++;
          console.log(`✅ Email sent successfully to ${participant.email}`);
        } else {
          results.failed++;
          console.log(`❌ Failed to send email to ${participant.email} after ${MAX_RETRIES} attempts`);
        }

        // Small delay between emails to prevent rate limiting
        await sleep(200);

      } catch (error) {
        console.error(`Error processing participant ${participant.email}:`, error);
        
        // Mark as failed
        await prisma.participant.update({
          where: { id: participant.id },
          data: {
            emailed: false,
          },
        });

        await prisma.deliveryAttempt.create({
          data: {
            participantId: participant.id,
            jobId: job.id,
            provider: "RESEND",
            status: "FAILED",
            attemptNo: 1,
            errorMessage: error instanceof Error ? error.message : "Processing error",
          },
        });
        
        results.failed++;
      }
    }

    await prisma.deliveryJob.update({
      where: { id: job.id },
      data: {
        status: results.failed > 0 ? "FAILED" : "COMPLETED",
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Batch processing completed`,
      results: {
        successful: results.successful,
        failed: results.failed,
        totalProcessed: results.totalProcessed,
        successRate: `${Math.round((results.successful / results.totalProcessed) * 100)}%`
      }
    });

  } catch (error) {
    console.error("Error in bulk email processing:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process bulk emails. Please try again." 
      },
      { status: 500 }
    );
  }
}
