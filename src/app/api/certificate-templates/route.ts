import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Fetch all certificate templates for the current user
export async function GET() {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch templates for the authenticated user
    const templates = await prisma.certificateTemplate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Return the templates
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching certificate templates:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma Client is properly disconnected
    await prisma.$disconnect();
  }
}

// Create a new certificate template
export async function POST(req: Request) {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body
    const { name, backgroundUrl } = await req.json();
    if (!name || !backgroundUrl) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Create a new certificate template
    const newTemplate = await prisma.certificateTemplate.create({
      data: { name, backgroundUrl, userId },
    });

    // Return the newly created template
    return NextResponse.json({ success: true, data: newTemplate }, { status: 201 });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error creating certificate template:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma Client is properly disconnected
    await prisma.$disconnect();
  }
}