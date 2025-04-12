import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Fetch previously used certificate templates
export async function GET() {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch distinct templates used in events
    const usedTemplates = await prisma.event.findMany({
      where: { userId },
      select: {
        template: true,
      },
      distinct: ["templateId"], // Ensure distinct templates
    });

    // Map the result to return only the template data
    const templates = usedTemplates.map((event) => event.template);

    // Return the response
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching used certificate templates:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  } finally {
    // Ensure Prisma Client is properly disconnected
    await prisma.$disconnect();
  }
}