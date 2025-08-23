import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { eventId, subject, transcript } = await req.json();

    if (!eventId || !subject || !transcript) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify event ownership
    const event = await prisma.event.findUnique({
      where: { id: eventId, userId },
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found or unauthorized" },
        { status: 404 }
      );
    }

    // Call the bulk email processing API
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/send-email/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        subject,
        transcript,
      }),
    });

    const result = await response.json();

    return NextResponse.json(result, { status: response.status });

  } catch (error) {
    console.error("Error in bulk email initiation:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to initiate bulk email sending" 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
