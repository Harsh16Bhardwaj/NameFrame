import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureCurrentUser } from "@/lib/auth/user";

type ConfirmRow = {
  name: string;
  email: string;
  participated?: boolean;
};

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

    const { rows } = (await request.json()) as { rows?: ConfirmRow[] };

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ success: false, error: "No rows provided" }, { status: 400 });
    }

    const result = await prisma.participant.createMany({
      data: rows.map((row) => ({
        eventId,
        name: row.name.trim(),
        email: row.email.trim().toLowerCase(),
        participated: Boolean(row.participated),
      })),
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        imported: result.count,
        total: rows.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Import confirm failed" },
      { status: 400 }
    );
  }
}
