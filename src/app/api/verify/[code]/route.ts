// app/api/verify/[code]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildVerifyUrl } from "@/lib/verification/qr";


// GET /api/verify/[code] - Public endpoint to verify certificates
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Verification code is required" },
        { status: 400 }
      );
    }

    const issue = await prisma.certificateIssue.findUnique({
      where: { verificationCode: code },
      include: {
        participant: true,
        event: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        template: true,
      },
    });

    if (issue) {
      return NextResponse.json({
        success: true,
        verified: true,
        certificate: {
          recipientName: issue.participant.name,
          recipientEmail: issue.participant.email,
          eventTitle: issue.event.title,
          issueDate: issue.createdAt,
          createdAt: issue.createdAt,
          role: issue.role,
          issuer: {
            name: issue.event.user.name,
            email: issue.event.user.email,
          },
          verificationCode: issue.verificationCode,
          certificateUrl: issue.certificateUrl,
          qrCodeUrl: issue.qrCodeUrl,
          verifyUrl: issue.verificationCode ? buildVerifyUrl(issue.verificationCode) : null,
        },
      });
    }

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

    const verificationData = {
      success: true,
      verified: true,
      certificate: {
        recipientName: participant.name,
        recipientEmail: participant.email,
        eventTitle: participant.event.title,
        issueDate: participant.createdAt,
        createdAt: participant.createdAt,
        issuer: {
          name: participant.event.user.name,
          email: participant.event.user.email,
        },
        verificationCode: participant.verificationCode,
        certificateUrl: participant.certificateUrl,
        qrCodeUrl: participant.qrCodeUrl,
        verifyUrl: participant.verificationCode ? buildVerifyUrl(participant.verificationCode) : null,
      },
    };

    return NextResponse.json(verificationData);
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error", verified: false },
      { status: 500 }
    );
  }
}
