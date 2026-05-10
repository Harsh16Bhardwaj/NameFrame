import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureCurrentUser } from "@/lib/auth/user";
import { previewParticipantFile } from "@/lib/participants/import";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const user = await ensureCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await params;
    const event = await prisma.event.findFirst({ where: { id: eventId, userId: user.id } });

    if (!event) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const preview = await previewParticipantFile(file);
    const existingParticipants = await prisma.participant.findMany({
      where: {
        eventId,
        email: { in: preview.validRows.map((row) => row.email) },
      },
      select: { email: true },
    });
    const existingEmails = new Set(existingParticipants.map((participant) => participant.email));

    const existingDuplicateRows = preview.validRows
      .filter((row) => existingEmails.has(row.email))
      .map((row) => ({
        rowNumber: row.rowNumber,
        message: "Email already exists for this event",
        raw: row,
      }));

    const validRows = preview.validRows.filter((row) => !existingEmails.has(row.email));

    return NextResponse.json({
      success: true,
      data: {
        ...preview,
        validRows,
        duplicateRows: [...preview.duplicateRows, ...existingDuplicateRows],
        summary: {
          totalRows: preview.totalRows,
          valid: validRows.length,
          invalid: preview.invalidRows.length,
          duplicates: preview.duplicateRows.length + existingDuplicateRows.length,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Import preview failed" },
      { status: 400 }
    );
  }
}
