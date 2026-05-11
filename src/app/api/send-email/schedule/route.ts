import { NextResponse } from "next/server";
import { DeliveryQueueTier } from "@/generated/prisma/enums";
import { requireCurrentUser, isProUser } from "@/lib/auth/user";
import { enqueueEventBatch } from "@/lib/delivery/service";

export async function POST(req: Request) {
  try {
    const user = await requireCurrentUser();
    if (!isProUser(user)) {
      return NextResponse.json(
        { success: false, error: "Scheduling is a Pro feature." },
        { status: 403 }
      );
    }

    const { eventId, subject, transcript, scheduledFor } = await req.json();
    if (!eventId || !subject || !transcript || !scheduledFor) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledFor);
    if (Number.isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid scheduledFor datetime" },
        { status: 400 }
      );
    }

    const enqueue = await enqueueEventBatch({
      eventId,
      requestedById: user.id,
      tier: DeliveryQueueTier.PREMIUM,
      scheduledFor: scheduledDate,
      subject,
      transcript,
    });

    return NextResponse.json({
      success: true,
      queueEventId: enqueue.queueEventId,
      alreadyQueued: enqueue.alreadyQueued,
      scheduledFor: scheduledDate.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to schedule send",
      },
      { status: 500 }
    );
  }
}
