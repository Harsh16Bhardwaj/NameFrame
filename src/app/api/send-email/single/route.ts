import { NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth/user";
import { sendSingleParticipant } from "@/lib/delivery/service";
import { MAILING_SERVICE_DOWN_MESSAGE } from "@/lib/delivery/public-messages";

export async function POST(req: Request) {
  const startedAt = Date.now();
  try {
    const user = await requireCurrentUser();
    const { participantId, eventId, subject, transcript } = await req.json();

    if (!participantId || !eventId || !subject || !transcript) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sendSingleParticipant({
      eventId,
      participantId,
      requestedById: user.id,
      subject,
      transcript,
    });
    console.log("[send-email/single] completed", {
      eventId,
      participantId,
      success: result.success,
      durationMs: Date.now() - startedAt,
      error: result.success ? null : result.error,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: MAILING_SERVICE_DOWN_MESSAGE,
          failedAttempts: result.failedAttempts ?? 3,
          toastCode: "EMAIL_FAILED_3_ATTEMPTS",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("[send-email/single] failed", {
      durationMs: Date.now() - startedAt,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error: MAILING_SERVICE_DOWN_MESSAGE,
      },
      { status: 500 }
    );
  }
}
