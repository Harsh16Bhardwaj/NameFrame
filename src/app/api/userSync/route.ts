// app/api/user-sync/route.ts
import { NextResponse } from "next/server";
import { ensureCurrentUser } from "@/lib/auth/user";


export async function POST(): Promise<NextResponse> {
  try {
    const user = await ensureCurrentUser();
    if (!user) {
      throw new Error("User is not authenticated");
    }
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("User sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync user", success: false },
      { status: 500 }
    );
  }
}
