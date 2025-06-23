// app/api/admin/add-verification/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { generateVerificationCode, generateCertificateHash } from "@/lib/verification";

const prisma = new PrismaClient();

// POST /api/admin/add-verification - Add verification codes to existing participants
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find all participants without verification codes for events owned by this user
    const participantsToUpdate = await prisma.participant.findMany({
      where: {
        verificationCode: null,
        event: {
          userId: userId,
        },
      },
      include: {
        event: true,
      },
    });

    let updatedCount = 0;

    for (const participant of participantsToUpdate) {
      const verificationCode = generateVerificationCode();
      const certificateHash = generateCertificateHash({
        recipientName: participant.name,
        eventTitle: participant.event.title,
        issueDate: participant.createdAt.toISOString(),
        verificationCode,
      });

      await prisma.participant.update({
        where: { id: participant.id },
        data: {
          verificationCode,
          certificateHash,
          isVerified: true,
          verifiedAt: new Date(),
        },
      });

      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} participants with verification codes`,
      updatedCount,
    });
  } catch (error) {
    console.error("Error adding verification codes:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
