import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const { templateUrl } = await request.json();

    if (!templateUrl) {
      return NextResponse.json(
        { success: false, error: "Template URL is required" },
        { status: 400 }
      );
    }

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

    // Update the template 
    if (!event.templateId) {
      return NextResponse.json(
        { success: false, error: "Template ID is missing" },
        { status: 400 }
      );
    }

    const updatedTemplate = await prisma.certificateTemplate.update({
      where: { id: event.templateId },
      data: {
        backgroundUrl: templateUrl,
      },
    });

    // Also update the event record for convenience
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        template: templateUrl,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        template: updatedTemplate,
        event: updatedEvent
      },
    });
  } catch (error) {
    console.error("Error updating template URL:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update template URL" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}