import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

const getCachedStats = unstable_cache(
  async (userId: string) => {
    const events = await prisma.event.findMany({
      where: { userId },
      include: {
        participants: {
          include: {
            deliveryAttempts: true,
            queueItems: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalEvents = events.length;
    const totalParticipants = events.reduce((sum, event) => sum + event.participants.length, 0);
    const totalEmailsSent = events.reduce(
      (sum, event) => sum + event.participants.filter((p) => p.emailed).length,
      0
    );
    const totalFailed = events.reduce(
      (sum, event) =>
        sum +
        event.participants.filter((p) =>
          p.queueItems.some((item) => item.status === "FAILED")
        ).length,
      0
    );
    const totalPending = Math.max(totalParticipants - totalEmailsSent - totalFailed, 0);
    const totalParticipated = events.reduce(
      (sum, event) => sum + event.participants.filter((p) => p.participated).length,
      0
    );

    const participationRate = totalParticipants
      ? Number(((totalParticipated / totalParticipants) * 100).toFixed(2))
      : 0;
    const deliveryRate = totalParticipants
      ? Number(((totalEmailsSent / totalParticipants) * 100).toFixed(2))
      : 0;

    const perEvent = events.map((event) => {
      const participants = event.participants.length;
      const sent = event.participants.filter((p) => p.emailed).length;
      const failed = event.participants.filter((p) =>
        p.queueItems.some((item) => item.status === "FAILED")
      ).length;
      const pending = Math.max(participants - sent - failed, 0);
      const participated = event.participants.filter((p) => p.participated).length;
      return {
        eventId: event.id,
        title: event.title,
        createdAt: event.createdAt,
        participants,
        sent,
        failed,
        pending,
        deliveryRate: participants ? Number(((sent / participants) * 100).toFixed(2)) : 0,
        participationRate: participants
          ? Number(((participated / participants) * 100).toFixed(2))
          : 0,
      };
    });

    const mostRecent = perEvent[0] || null;
    const previous = perEvent[1] || null;
    const eventComparison = mostRecent && previous
      ? {
          currentEventId: mostRecent.eventId,
          previousEventId: previous.eventId,
          deliveryRateDelta: Number((mostRecent.deliveryRate - previous.deliveryRate).toFixed(2)),
          participationRateDelta: Number(
            (mostRecent.participationRate - previous.participationRate).toFixed(2)
          ),
        }
      : null;

    const topByDelivery = [...perEvent]
      .sort((a, b) => b.deliveryRate - a.deliveryRate)
      .slice(0, 5);
    const bottomByDelivery = [...perEvent]
      .sort((a, b) => a.deliveryRate - b.deliveryRate)
      .slice(0, 5);

    const recentAttempts = await prisma.deliveryAttempt.findMany({
      where: { job: { event: { userId } } },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { status: true, provider: true, attemptNo: true },
    });

    const retryDistribution = recentAttempts.reduce<Record<string, number>>((acc, item) => {
      const key = `attempt_${item.attemptNo}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const providerBreakdown = recentAttempts.reduce<
      Record<string, { sent: number; failed: number }>
    >((acc, item) => {
      acc[item.provider] ||= { sent: 0, failed: 0 };
      if (item.status === "SENT") acc[item.provider].sent += 1;
      else acc[item.provider].failed += 1;
      return acc;
    }, {});

    const queueEvents = await prisma.deliveryQueueEvent.findMany({
      where: {
        event: { userId },
        status: { in: ["PENDING", "RUNNING"] },
      },
      select: { enqueuedAt: true },
    });
    const now = Date.now();
    const queueAgeBuckets = {
      lt1h: 0,
      h1to6: 0,
      h6to18: 0,
      gte18: 0,
    };
    for (const q of queueEvents) {
      const hours = (now - q.enqueuedAt.getTime()) / (1000 * 60 * 60);
      if (hours < 1) queueAgeBuckets.lt1h += 1;
      else if (hours < 6) queueAgeBuckets.h1to6 += 1;
      else if (hours < 18) queueAgeBuckets.h6to18 += 1;
      else queueAgeBuckets.gte18 += 1;
    }

    return {
      totalEvents,
      totalParticipants,
      totalCertificates: totalParticipants,
      totalEmailsSent,
      totalFailed,
      totalPending,
      participationRate,
      deliveryRate,
      perEvent,
      topByDelivery,
      bottomByDelivery,
      retryDistribution,
      providerBreakdown,
      queueAgeBuckets,
      eventComparison,
    };
  },
  ["dashboard-stats-v2"],
  { revalidate: 60 }
);

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await getCachedStats(userId);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
