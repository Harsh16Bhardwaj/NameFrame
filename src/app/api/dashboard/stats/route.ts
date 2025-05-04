import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Get all events for the user
    const events = await prisma.event.findMany({
      where: { userId },
      include: {
        participants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate total events
    const totalEvents = events.length;

    // Calculate total participants across all events
    const totalParticipants = events.reduce((sum, event) => sum + event.participants.length, 0);

    // Get participants from the most recent event for change calculation
    const mostRecentEvent = events[0];
    const recentParticipants = mostRecentEvent ? mostRecentEvent.participants.length : 0;

    // Calculate total certificates generated (for now, same as total participants)
    const totalCertificates = totalParticipants;

    // Calculate total emails sent
    const totalEmailsSent = events.reduce((sum, event) => 
      sum + event.participants.filter(p => p.emailed).length, 0
    );

    // Calculate emails sent in the most recent event
    const recentEmailsSent = mostRecentEvent ? 
      mostRecentEvent.participants.filter(p => p.emailed).length : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalEvents,
        totalParticipants,
        recentParticipants,
        totalCertificates,
        totalEmailsSent,
        recentEmailsSent
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 