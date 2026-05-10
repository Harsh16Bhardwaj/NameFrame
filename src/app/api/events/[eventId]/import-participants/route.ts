import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Direct participant import is disabled. Use preview, then confirm import.",
    },
    { status: 410 }
  );
}
