import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import cloudinary from "cloudinary";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req: Request) {
  try {
    const { subject, transcript, eventId } = await req.json();

    if (!subject || !transcript || !eventId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: subject, transcript, or eventId" },
        { status: 400 }
      );
    }

    // Fetch participants who haven't been emailed yet
    const participants = await prisma.participant.findMany({
      where: { eventId, emailed: false },
      take: 10, // Process in batches of 10
    });

    if (participants.length === 0) {
      return NextResponse.json(
        { success: false, message: "No participants left to email" },
        { status: 200 }
      );
    }

    const emailPromises = participants.map(async (participant) => {
      // Generate certificate URL using Cloudinary overlay
      const certificateUrl = cloudinary.v2.url("certificate_template", {
        overlay: {
          font_family: "Arial",
          font_size: 60,
          text: participant.name,
        },
        transformation: [{ width: 800, crop: "scale" }],
      });

      // Send email
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

      return participant.id;
    });

    // Wait for all emails to be sent
    const emailedParticipantIds = await Promise.all(emailPromises);

    // Update database to mark participants as emailed
    await prisma.participant.updateMany({
      where: { id: { in: emailedParticipantIds } },
      data: { emailed: true },
    });

    return NextResponse.json(
      { success: true, message: "Emails sent successfully", count: emailedParticipantIds.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}