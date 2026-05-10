import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureCurrentUser } from "@/lib/auth/user";

type WinnerInput = {
  position: "FIRST" | "SECOND" | "THIRD";
  name: string;
  email: string;
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await ensureCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    const event = await prisma.event.findFirst({ where: { id: eventId, userId: user.id } });

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    const { winners } = (await request.json()) as { winners?: WinnerInput[] };
    const normalizedWinners = (winners ?? [])
      .map((winner) => ({
        ...winner,
        name: winner.name.trim(),
        email: winner.email.trim().toLowerCase(),
      }))
      .filter((winner) => winner.name && winner.email && winner.position);

    await prisma.$transaction(async (tx) => {
      await tx.eventAwardAssignment.deleteMany({ where: { eventId } });

      for (const winner of normalizedWinners) {
        const participant = await tx.participant.upsert({
          where: { eventId_email: { eventId, email: winner.email } },
          create: {
            eventId,
            name: winner.name,
            email: winner.email,
            participated: true,
          },
          update: {
            name: winner.name,
            participated: true,
          },
        });

        await tx.eventAwardAssignment.create({
          data: {
            eventId,
            participantId: participant.id,
            position: winner.position,
          },
        });
      }
    });

    return NextResponse.json({ success: true, data: { saved: normalizedWinners.length } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Award save failed" },
      { status: 400 }
    );
  }
}
