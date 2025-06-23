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
    console.log('Events data:', events);
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
  console.log('POST /api/events called'); // Debug log
  
  try {
    const { userId } = await auth();
    console.log('Auth userId:', userId); // Debug log
    
    if (!userId) {
      console.log('No userId found, returning unauthorized'); // Debug log
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    console.log('Received POST body:', JSON.stringify(body, null, 2)); // Debug log
    
    const { title, templateUrl, textPosition } = body;
    if (!title || !templateUrl) {
      console.log('Missing required fields:', { title, templateUrl }); // Debug log
      return NextResponse.json(
        { success: false, error: "Missing required fields: title or templateUrl" },
        { status: 400 }
      );    }

    console.log('Creating certificate template...'); // Debug log
    
    // Ensure user exists in database before creating template
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          email: 'user@example.com', // Placeholder, will be updated by userSync
          name: 'User', // Placeholder, will be updated by userSync
        },
      });
      console.log('User ensured in database'); // Debug log
    } catch (userError) {
      console.log('User creation/check failed, continuing...', userError);
    }
    
    // First, create a template using the Cloudinary URL
    const newTemplate = await prisma.certificateTemplate.create({
      data: {
        name: `Template for ${title}`,
        backgroundUrl: templateUrl,
        userId: userId,
        textPositionX: textPosition?.x || 50,
        textPositionY: textPosition?.y || 50,
        textWidth: textPosition?.width || 80,
        textHeight: textPosition?.height || 15,
      },
    });
    console.log('Template created:', newTemplate.id); // Debug log

    console.log('Creating event...'); // Debug log
    // Then create the event with the new template ID
    const newEvent = await prisma.event.create({
      data: {
        title,
        userId: userId,
        templateId: newTemplate.id,
      },
    });
    console.log('Event created:', newEvent.id); // Debug log

    return NextResponse.json({ success: true, data: newEvent }, { status: 201 });
  } catch (error: unknown) {
    console.error('Full error object:', error); // Debug log
    if (error instanceof Error) {
      console.error('Error creating event:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        env: process.env.NODE_ENV,
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create event. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json(
        { success: false, error: 'Unknown server error.' },
        { status: 500 }
      );
    }
  } finally {
    console.log('Disconnecting Prisma client...'); // Debug log
    await prisma.$disconnect();
  }
}