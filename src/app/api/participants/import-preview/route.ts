import { NextRequest, NextResponse } from "next/server";
import { ensureCurrentUser } from "@/lib/auth/user";
import { previewParticipantFile } from "@/lib/participants/import";

export async function POST(request: NextRequest) {
  try {
    const user = await ensureCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const preview = await previewParticipantFile(file);

    return NextResponse.json({
      success: true,
      data: {
        ...preview,
        summary: {
          totalRows: preview.totalRows,
          valid: preview.validRows.length,
          invalid: preview.invalidRows.length,
          duplicates: preview.duplicateRows.length,
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
