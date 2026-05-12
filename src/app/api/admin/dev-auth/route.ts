import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.DEV_PASS;

  if (!expected) {
    return NextResponse.json({ success: false, error: "DEV_PASS is not configured" }, { status: 500 });
  }

  if (!body.password || body.password !== expected) {
    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("dev_admin_auth", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  return NextResponse.json({ success: true });
}
