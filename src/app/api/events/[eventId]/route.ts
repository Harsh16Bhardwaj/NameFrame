// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

interface Params {
  params: { eventId: string }; // Changed from id to eventId
}

export async function GET(_: Request, { params }: Params) {
  const prisma = new PrismaClient();

  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the event with the specified ID for the authenticated user
    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId, // Changed from params.id to params.eventId
        userId,
      },
      include: {
        template: true,
        participants: true,
      },
    });

    // If the event is not found, return a 404 response
    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    // Return the event data
    return NextResponse.json({ success: true, data: event });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma Client is properly disconnected
    await prisma.$disconnect();
  }
}
