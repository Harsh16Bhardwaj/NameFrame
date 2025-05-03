import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Handle PATCH request to update template settings
export async function PATCH(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the event ID from the URL params
    const { eventId } = params;

    // Parse the body of the request
    const {
      textPositionX,
      textPositionY,
      textWidth,
      textHeight,
      fontFamily,
      fontSize,
      fontColor
    } = await request.json();

    // Verify the event belongs to the authenticated user
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { userId: true, templateId: true }
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    if (event.userId !== userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure templateId is not null before updating
    if (!event.templateId) {
      return NextResponse.json(
        { success: false, error: "Template ID is missing" },
        { status: 400 }
      );
    }

    // Update the template settings
    const updated = await prisma.certificateTemplate.update({
      where: { id: event.templateId },
      data: {
        textPositionX,
        textPositionY,
        textWidth,
        textHeight,
        fontFamily,
        fontSize,
        fontColor
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update template settings" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}