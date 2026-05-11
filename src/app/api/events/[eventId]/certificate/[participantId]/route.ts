import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { buildParticipantCertificate } from "@/lib/certificate/pipeline";

type RouteContext = {
  params: Promise<{
    eventId: string;
    participantId: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, participantId } = await params;
    const asAttachment = new URL(request.url).searchParams.get("download") === "1";
    const built = await buildParticipantCertificate({ userId, eventId, participantId });
    const fileName = `${built.participant.name.replace(/\s+/g, "_")}_certificate.png`;
    if (!asAttachment) {
      return NextResponse.redirect(built.certificateUrl, { status: 307 });
    }

    try {
      const imageResponse = await fetch(built.certificateUrl);
      if (!imageResponse.ok) {
        return NextResponse.redirect(built.certificateUrl, { status: 307 });
      }

      const bytes = await imageResponse.arrayBuffer();
      return new NextResponse(bytes, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
          "Content-Disposition": `attachment; filename="${fileName}"`,
        },
      });
    } catch {
      return NextResponse.redirect(built.certificateUrl, { status: 307 });
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to build certificate",
      },
      { status: 500 }
    );
  }
}
