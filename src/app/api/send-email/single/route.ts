import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Update: Use Gmail service instead of generic SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail service instead of specifying host/port
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Fix the TypeScript issues in the transformation options
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
    const publicIdMatch = templateUrl.match(/\/v\d+\/([^/]+)\.\w+$/);
    const publicId = publicIdMatch
      ? publicIdMatch[1]
      : "certificate_templates/default";

    // Generate certificate URL with proper text overlay
    const certificateUrl = cloudinary.url(publicId, {
      transformation: [
        {
          overlay: {
            font_family: "Arial",
            font_size: 90,
            font_weight: "bold",
            text: participant.name,
          },
          color: "black",
          gravity: "center",
          // Fix TypeScript issues by using proper type checks
          y: typeof event.template?.textPositionY === "number" ? (event.template.textPositionY - 50) * 10 : 0,
          x: typeof event.template?.textPositionX === "number" ? (event.template.textPositionX - 50) * 10 : 0,
        },
      ],
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: participant.email,
      subject,
      html: `
        <p>${transcript}</p>
        <p>Here is your certificate:</p>
        <a href="${certificateUrl}" target="_blank">Download Certificate</a>
      `,
    });

    // Mark the participant as emailed
    await prisma.participant.update({
      where: { id: participant.id },
      data: { emailed: true, certificateUrl },
    });

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${participant.email}`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
