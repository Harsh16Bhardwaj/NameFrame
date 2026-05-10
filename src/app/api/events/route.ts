// app/api/events/route.ts
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { buildEditorConfig } from "@/lib/certificate/editor-config";

// Use a single PrismaClient instance to avoid connection issues in production

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
    
    // Check if user exists in database before creating template
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      
      if (!existingUser) {
        console.log('User not found in database. Attempting to create user...');
        
        // Get user details from Clerk
        const clerkUser = await currentUser();
        if (!clerkUser || !clerkUser.emailAddresses || clerkUser.emailAddresses.length === 0) {
          return NextResponse.json(
            { success: false, error: "Unable to retrieve user information" },
            { status: 400 }
          );
        }
        
        const userEmail = clerkUser.emailAddresses[0].emailAddress;
        const fullName = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();
        
        // Create the user
        await prisma.user.create({
          data: {
            id: userId,
            email: userEmail,
            name: fullName || 'New User',
          },
        });
        
        console.log(`User created: ${userId}`);
      } else {
        console.log('User found in database:', existingUser.id); // Debug log
      }
    } catch (userError) {
      console.log('User creation/check failed:', userError);
      return NextResponse.json(
        { success: false, error: "Failed to verify or create user. Please try again." },
        { status: 500 }
      );
    }
    
    // First, create a template using the Cloudinary URL
    const newTemplate = await prisma.certificateTemplate.create({
      data: {
        name: `Template for ${title}`,
        backgroundUrl: templateUrl,
        userId: userId,
        editorConfigJson: buildEditorConfig({
          textPositionX: textPosition?.x,
          textPositionY: textPosition?.y,
          textWidth: textPosition?.width,
          textHeight: textPosition?.height,
        }),
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
  }
}
