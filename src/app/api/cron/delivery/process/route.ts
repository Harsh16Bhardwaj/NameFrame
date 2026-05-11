import { NextResponse } from "next/server";
import { processQueueTick } from "@/lib/delivery/service";

function authorized(req: Request) {
  const header = req.headers.get("x-cron-secret");
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return header === secret;
}

export async function POST(req: Request) {
  try {
    if (!authorized(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized cron call" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const limitEvents =
      typeof body?.limitEvents === "number" && body.limitEvents > 0 ? body.limitEvents : 1;
    const participantsPerChunk =
      typeof body?.participantsPerChunk === "number" && body.participantsPerChunk > 0
        ? Math.min(body.participantsPerChunk, 20)
        : 5;

    const result = await processQueueTick({
      maxEventsPerTick: Math.min(limitEvents, 5),
      participantsPerChunk,
    });

    return NextResponse.json({
      success: true,
      processedEvents: result.processedEvents,
      participantsPerChunk,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Cron processing failed",
      },
      { status: 500 }
    );
  }
}
