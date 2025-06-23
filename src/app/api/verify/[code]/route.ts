// app/api/verify/[code]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/verify/[code] - Public endpoint to verify certificates
export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Verification code is required" },
        { status: 400 }
      );
    }

    // Find participant by verification code
    const participant = await prisma.participant.findUnique({
      where: { verificationCode: code },
      include: {
        event: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            template: true,
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Certificate not found or invalid verification code",
          verified: false 
        },
        { status: 404 }
      );
    }

    // Check if certificate is verified
    if (!participant.isVerified) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Certificate is not verified", 
          verified: false 
        },
        { status: 400 }
      );
    }

    // Return verification details
    const verificationData = {
      success: true,
      verified: true,
      certificate: {
        recipientName: participant.name,
        recipientEmail: participant.email,
        eventTitle: participant.event.title,
        issueDate: participant.verifiedAt,
        createdAt: participant.createdAt,
        issuer: {
          name: participant.event.user.name,
          email: participant.event.user.email,
        },
        verificationCode: participant.verificationCode,
        certificateUrl: participant.certificateUrl,
      },
    };

    return NextResponse.json(verificationData);
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", verified: false },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
