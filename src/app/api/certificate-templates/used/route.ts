import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the type for the response data structure for multiple templates
interface TemplatesResponse {
  success: boolean;
  data?: string[];
  error?: string;
}

// Define the type for the response data structure for a single template
interface TemplateResponse {
  success: boolean;
  data?: any;  // Full template data
  error?: string;
}

// Define the type for the event object
interface Event {
  template: { 
    id: string; 
    name: string; 
    fontFamily: string; 
    fontSize: number; 
    userId: string; 
    textPositionX: number; 
    textPositionY: number; 
    textWidth: number; 
    textHeight: number; 
    fontColor: string; 
    backgroundUrl: string; 
    createdAt: Date; 
    updatedAt: Date; 
  } | null;
  templateId: string | null;
}

// Fetch previously used certificate templates
export async function GET(req: Request): Promise<NextResponse<TemplatesResponse | TemplateResponse>> {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if an event ID is provided in the URL
    const url = new URL(req.url);
    const eventId = url.searchParams.get('eventId');

    // If event ID is provided, fetch the template for that specific event
    if (eventId) {
      const event = await prisma.event.findUnique({
        where: { 
          id: eventId,
          userId // Ensure the event belongs to the current user
        },
        include: {
          template: true
        }
      });

      if (!event) {
        return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
      }

      if (!event.template) {
        return NextResponse.json({ success: false, error: "No template associated with this event" }, { status: 404 });
      }

      // Return the complete template data
      return NextResponse.json({ 
        success: true, 
        data: event.template 
      });
    } 
    // Otherwise, fetch all distinct templates as before
    else {
      const usedTemplates = await prisma.event.findMany({
        where: { userId },
        select: {
          template: true,
          templateId: true,
        },
        distinct: ["templateId"],  
      });

      // Extract the background URLs instead of template names
      const templateUrls: string[] = usedTemplates
        .map((event) => event.template?.backgroundUrl)
        .filter((backgroundUrl): backgroundUrl is string => !!backgroundUrl);

      // Return the list of template background URLs
      return NextResponse.json({ success: true, data: templateUrls });
    }
  } catch (error) {
    console.error("Error fetching certificate template:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
