import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { v2 as cloudinary } from "cloudinary";
import { generateCertificateEmail } from "../emailTemplate";
import { extractPublicId } from 'cloudinary-build-url';
import { generateVerificationCode, generateCertificateHash } from "@/lib/verification";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { participantId, eventId, subject, transcript } = await req.json();

    if (!participantId || !eventId || !subject || !transcript) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the participant
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, error: "Participant not found" },
        { status: 404 }
      );
    }

    // Fetch the event and check ownership
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        template: true,
      },
    });

    if (!event || event.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if template exists and has a backgroundUrl
    if (!event.template || !event.template.backgroundUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Template not found or missing background image",
        },
        { status: 404 }
      );
    }

    // Extract public ID from the template URL
    const templateUrl = event.template.backgroundUrl;
    const publicId = extractPublicId(templateUrl);
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: "Invalid template URL" },
        { status: 400 }
      );
    }    // Generate verification code if not already present
    let verificationCode = participant.verificationCode;
    if (!verificationCode) {
      verificationCode = generateVerificationCode();
    }

    // Use template settings from DB for Cloudinary transformations
    const certificateUrl = cloudinary.url(publicId, {
      transformation: [
        {
          overlay: {
            font_family: event.template.fontFamily || "Arial",
            font_size: event.template.fontSize || 48,
            font_weight: "bold",
            text: participant.name,
          },
          color: event.template.fontColor || "#000000",
          width: event.template.textWidth*11 || 800,
          height: event.template.textHeight*9 || 150,
          gravity: "center",
          y: typeof event.template.textPositionY === "number"
            ? Math.round((event.template.textPositionY - 50) * 10)
            : 0,
          x: typeof event.template.textPositionX === "number"            ? Math.round((event.template.textPositionX - 50) * 10)
            : 0,
        },
        // Add verification code as a small watermark
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
      ],      format: "png",
      quality: "auto:best",
    });

    // Generate certificate hash for integrity
    const certificateHash = generateCertificateHash({
      recipientName: participant.name,
      eventTitle: event.title,
      issueDate: new Date().toISOString(),
      verificationCode,
    });

    // Update participant with certificate URL and verification data
    await prisma.participant.update({
      where: { id: participant.id },
      data: { 
        certificateUrl,
        verificationCode,
        certificateHash,
        isVerified: true,
        verifiedAt: new Date(),
      },
    });    const emailHtml = generateCertificateEmail({
      subject,
      eventTitle: event.title,
      participantName: participant.name,
      transcript,
      certificateUrl,
      verificationCode, // Add verification code to email
    });

    try {
      const emailResult = await resend.emails.send({
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
      });

      if (emailResult.error) {
        console.error("Resend API error:", emailResult.error);
        return NextResponse.json(
          { 
            success: false, 
            error: `Email API error: ${emailResult.error.message || "Unknown error"}`,
            details: emailResult.error
          },
          { status: 500 }
        );
      }

      // Mark the participant as emailed only if email was sent successfully
      await prisma.participant.update({
        where: { id: participant.id },
        data: { emailed: true },
      });

      return NextResponse.json({
        success: true,
        message: `Email sent successfully to ${participant.email}`,
        emailId: emailResult,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        { 
          success: false, 
          error: `Email exception: ${emailError instanceof Error ? emailError.message : "Unknown error"}` 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to process: ${error instanceof Error ? error.message : "Unknown error"}` 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}