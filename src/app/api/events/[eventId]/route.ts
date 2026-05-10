// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { toLegacyTemplateConfig } from "@/lib/certificate/editor-config";
import { groupTemplateBindings } from "@/lib/events/templates";

interface Params {
  params: { eventId: string };
}

export async function GET(_: Request, { params }: Params) {
  
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      console.error("[API][Event GET] Unauthorized access attempt.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { eventId } = await params;
    if (!eventId) {
      console.error("[API][Event GET] No eventId provided in params.");
      return NextResponse.json({ error: "No eventId provided." }, { status: 400 });
    }

    console.log("[API][Event GET] Fetching event with ID:", eventId, "for user:", userId);

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
        userId,
      },
      include: {
        template: true,
        participants: true,
        templateBindings: { include: { template: true } },
        awardAssignments: { include: { participant: true } },
      },
    });

    if (!event) {
      console.error(`[API][Event GET] Event not found for eventId: ${eventId}, userId: ${userId}`);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }    // Ensure participants is always an array
    const legacyConfig = event.template ? toLegacyTemplateConfig(event.template.editorConfigJson) : {};
    const safeEvent = {
      ...event,
      ...legacyConfig,
      roleTemplates: groupTemplateBindings(event.templateBindings),
      participants: Array.isArray(event.participants)
        ? event.participants.map((participant) => ({
            ...participant,
            emailStatus: participant.emailed ? "sent" : "pending",
            emailAttempts: 0,
          }))
        : [],
      awards: event.awardAssignments,
    };

    return NextResponse.json({
      success: true,
      data: safeEvent
    });
  } catch (error) {
    console.error("[API][Event GET] Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
