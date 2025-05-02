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
    console.log('Events data:',events)
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
    const { title, templateUrl, textPosition } = body;
    if (!title || !templateUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title or templateUrl" },
        { status: 400 }
      );
    }
    
    // First, create a template using the Cloudinary URL
    const newTemplate = await prisma.certificateTemplate.create({
      data: {
        name: `Template for ${title}`,
        backgroundUrl: templateUrl,
        userId: userId,
        textPositionX: textPosition?.x ?? 50,
        textPositionY: textPosition?.y ?? 50,
        textWidth: textPosition?.width ?? 80,
        textHeight: textPosition?.height ?? 15,
      },
    });
    
    // Then create the event with the new template ID
    const newEvent = await prisma.event.create({
      data: {
        title,
        userId: userId,
        templateId: newTemplate.id,
      },
    });
    
    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}