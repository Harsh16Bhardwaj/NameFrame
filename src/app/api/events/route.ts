// app/api/events/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

// Use a single PrismaClient instance to avoid connection issues in production
const prisma = new PrismaClient();

// GET /api/events - Get all events for the current user
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const events = await prisma.event.findMany({
      where: { userId },
      include: {
        template: true,
        participants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, templateId } = body;

    if (!title || !templateId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        userId,
        templateId,
      },
    });

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
