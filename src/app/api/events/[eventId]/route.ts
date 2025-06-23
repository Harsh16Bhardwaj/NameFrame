// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

interface Params {
  params: { eventId: string };
}

export async function GET(_: Request, { params }: Params) {
  const prisma = new PrismaClient();

  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      console.error("[API][Event GET] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { eventId } = await params;
    if (!eventId) {
      console.error("[API][Event GET] No eventId provided in params.");
      return NextResponse.json({ error: "No eventId provided." }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        userId,
      },
      include: {
        template: true,
        participants: true,
      },
    });

    if (!event) {
      console.error(`[API][Event GET] Event not found for eventId: ${eventId}, userId: ${userId}`);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Ensure participants is always an array
    const safeEvent = {
      ...event,
      participants: Array.isArray(event.participants) ? event.participants : [],
    };

    return NextResponse.json(safeEvent);
  } catch (error) {
    console.error("[API][Event GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
