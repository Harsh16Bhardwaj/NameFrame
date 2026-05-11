import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildVerifyUrl } from "@/lib/verification/qr";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { code?: string };
    const code = body.code?.trim();
    if (!code) {
      return NextResponse.json(
        { success: false, verified: false, error: "Verification code is required" },
        { status: 400 }
      );
    }

    const issue = await prisma.certificateIssue.findUnique({
      where: { verificationCode: code },
      include: {
        participant: true,
        event: { include: { user: { select: { name: true, email: true } } } },
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
          issuer: issue.event.user,
          verificationCode: issue.verificationCode,
          certificateUrl: issue.certificateUrl,
          qrCodeUrl: issue.qrCodeUrl,
          verifyUrl: buildVerifyUrl(issue.verificationCode),
        },
      });
    }

    const participant = await prisma.participant.findUnique({
      where: { verificationCode: code },
      include: {
        event: {
          include: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { success: false, verified: false, error: "Certificate not found or invalid verification code" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      certificate: {
        recipientName: participant.name,
        recipientEmail: participant.email,
        eventTitle: participant.event.title,
        issueDate: participant.createdAt,
        createdAt: participant.createdAt,
        issuer: participant.event.user,
        verificationCode: participant.verificationCode,
        certificateUrl: participant.certificateUrl,
        qrCodeUrl: participant.qrCodeUrl,
        verifyUrl: participant.verificationCode ? buildVerifyUrl(participant.verificationCode) : null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, verified: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
