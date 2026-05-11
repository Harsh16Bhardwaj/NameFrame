import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth/user";
import { prisma } from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { eventId } = await params;

    const event = await prisma.event.findFirst({
      where: { id: eventId, userId: user.id },
      select: { id: true },
    });
    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    const queueEvent = await prisma.deliveryQueueEvent.findFirst({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            participant: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!queueEvent) {
      return NextResponse.json({
        success: true,
        queue: null,
        summary: { total: 0, sent: 0, pending: 0, failed: 0 },
        failedParticipants: [],
      });
    }

    const sent = queueEvent.items.filter((i) => i.status === "SENT").length;
    const pending = queueEvent.items.filter((i) => i.status === "PENDING").length;
    const failed = queueEvent.items.filter((i) => i.status === "FAILED").length;
    const failedParticipants = queueEvent.items
      .filter((i) => i.status === "FAILED")
      .map((i) => ({
        participantId: i.participantId,
        name: i.participant.name,
        email: i.participant.email,
        reason: i.lastError || "UNKNOWN:Send failed",
        attemptCount: i.attemptCount,
        lastTriedAt: i.lastTriedAt,
      }));

    return NextResponse.json({
      success: true,
      queue: {
        id: queueEvent.id,
        status: queueEvent.status,
        tier: queueEvent.tier,
        enqueuedAt: queueEvent.enqueuedAt,
        startedAt: queueEvent.startedAt,
        completedAt: queueEvent.completedAt,
      },
      summary: {
        total: queueEvent.items.length,
        sent,
        pending,
        failed,
      },
      failedParticipants,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to load delivery status" },
      { status: 500 }
    );
  }
}
