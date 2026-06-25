import { NextResponse } from "next/server";
import { DeliveryQueueTier } from "@/generated/prisma/enums";
import { requireCurrentUser, isProUser } from "@/lib/auth/user";
import { enqueueEventBatch, processQueueTick } from "@/lib/delivery/service";
import { prisma } from "@/lib/db";
import { MAILING_SERVICE_DOWN_MESSAGE } from "@/lib/delivery/public-messages";

export async function POST(req: Request) {
  const startedAt = Date.now();
  try {
    const user = await requireCurrentUser();
    const { subject, transcript, eventId } = await req.json();

    if (!subject || !transcript || !eventId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: subject, transcript, or eventId" },
        { status: 400 }
      );
    }

    const tier = isProUser(user) ? DeliveryQueueTier.PREMIUM : DeliveryQueueTier.REGULAR;
    const enqueue = await enqueueEventBatch({
      eventId,
      requestedById: user.id,
      tier,
      subject,
      transcript,
    });

    // Premium: trigger immediate processing tick.
    if (tier === DeliveryQueueTier.PREMIUM) {
      await processQueueTick({ maxEventsPerTick: 1, participantsPerChunk: 5 });
    }

    const queueEvent = await prisma.deliveryQueueEvent.findUnique({
      where: { id: enqueue.queueEventId },
      include: { items: true },
    });

    const summary = {
      total: queueEvent?.items.length ?? 0,
      sent: queueEvent?.items.filter((x) => x.status === "SENT").length ?? 0,
      failed: queueEvent?.items.filter((x) => x.status === "FAILED").length ?? 0,
      pending: queueEvent?.items.filter((x) => x.status === "PENDING").length ?? 0,
    };

    const failedParticipants = (queueEvent?.items || [])
      .filter((x) => x.status === "FAILED")
      .map((x) => ({
        participantId: x.participantId,
        reason: MAILING_SERVICE_DOWN_MESSAGE,
        attemptCount: x.attemptCount,
      }));

    return NextResponse.json({
      success: true,
      queueEventId: enqueue.queueEventId,
      alreadyQueued: enqueue.alreadyQueued,
      tier,
      mode: tier === DeliveryQueueTier.PREMIUM ? "immediate_or_priority" : "regular_24h_queue",
      summary,
      failedParticipants,
    });
  } catch (error) {
    console.error("[send-email/bulk] failed", {
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error: MAILING_SERVICE_DOWN_MESSAGE,
      },
      { status: 500 }
    );
  }
}
