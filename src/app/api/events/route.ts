// app/api/events/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildEditorConfig } from "@/lib/certificate/editor-config";
import { ensureCurrentUser } from "@/lib/auth/user";
import { groupTemplateBindings } from "@/lib/events/templates";

// Use a single PrismaClient instance to avoid connection issues in production

// GET /api/events - Get all events for the current user
export async function GET() {
  try {
    const user = await ensureCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const events = await prisma.event.findMany({
      where: { userId: user.id },
      include: {
        template: true,
        participants: true,
        templateBindings: {
          include: { template: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({
      success: true,
      data: events.map((event) => ({
        ...event,
        roleTemplates: groupTemplateBindings(event.templateBindings),
      })),
    });
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
  try {
    const user = await ensureCurrentUser();

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const {
      title,
      description,
      imageUrl,
      organizationName,
      organizationLogoUrl,
      certificateTitle,
      location,
      emailContentText,
      templateUrl,
      roleTemplateUrls,
      textPosition,
      participantRows,
    } = body;

    if (!title || !templateUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title or templateUrl" },
        { status: 400 }
      );    }
    
    const editorConfigJson = buildEditorConfig({
      textPositionX: textPosition?.x,
      textPositionY: textPosition?.y,
      textWidth: textPosition?.width,
      textHeight: textPosition?.height,
    });

    const defaultTemplate = await prisma.certificateTemplate.create({
      data: {
        name: `${title} Default Template`,
        backgroundUrl: templateUrl,
        userId: user.id,
        editorConfigJson,
      },
    });

    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        organizationName,
        organizationLogoUrl,
        certificateTitle,
        location,
        emailContentText,
        userId: user.id,
        templateId: defaultTemplate.id,
      },
    });

    let importedParticipants = 0;
    if (Array.isArray(participantRows) && participantRows.length > 0) {
      const sanitizedRows = participantRows
        .map((row) => ({
          name: typeof row?.name === "string" ? row.name.trim() : "",
          email: typeof row?.email === "string" ? row.email.trim().toLowerCase() : "",
          participated: Boolean(row?.participated),
        }))
        .filter((row) => row.name.length > 0 && row.email.length > 0);

      if (sanitizedRows.length > 0) {
        const result = await prisma.participant.createMany({
          data: sanitizedRows.map((row) => ({
            eventId: newEvent.id,
            name: row.name,
            email: row.email,
            participated: row.participated,
          })),
          skipDuplicates: true,
        });
        importedParticipants = result.count;
      }
    }

    const bindings: Array<{ role: "DEFAULT" | "FIRST" | "SECOND" | "THIRD"; templateId: string }> = [
      { role: "DEFAULT", templateId: defaultTemplate.id },
    ];
    const optionalRoles = [
      ["FIRST", roleTemplateUrls?.first],
      ["SECOND", roleTemplateUrls?.second],
      ["THIRD", roleTemplateUrls?.third],
    ] as const;

    for (const [role, url] of optionalRoles) {
      if (!url) continue;

      const template = await prisma.certificateTemplate.create({
        data: {
          name: `${title} ${role.toLowerCase()} Template`,
          backgroundUrl: url,
          userId: user.id,
          editorConfigJson,
        },
      });
      bindings.push({ role, templateId: template.id });
    }

    await prisma.eventCertificateTemplate.createMany({
      data: bindings.map((binding) => ({
        eventId: newEvent.id,
        templateId: binding.templateId,
        role: binding.role,
      })),
    });

    return NextResponse.json(
      { success: true, data: { ...newEvent, importedParticipants } },
      { status: 201 }
    );
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
