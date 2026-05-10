import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/enums";

type ClerkUserEvent = {
  type: "user.created" | "user.updated";
  data: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    email_addresses?: Array<{
      email_address: string;
      id: string;
    }>;
    primary_email_address_id?: string | null;
    public_metadata?: Record<string, unknown>;
    private_metadata?: Record<string, unknown>;
  };
};

function getPrimaryEmail(data: ClerkUserEvent["data"]) {
  return (
    data.email_addresses?.find((email) => email.id === data.primary_email_address_id)?.email_address ??
    data.email_addresses?.[0]?.email_address
  );
}

function normalizeRole(value: unknown) {
  return value === UserRole.PRO ? UserRole.PRO : value === UserRole.FREE ? UserRole.FREE : undefined;
}

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "CLERK_WEBHOOK_SECRET is required" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing webhook headers" }, { status: 400 });
  }

  const payload = await request.text();
  const webhook = new Webhook(secret);

  let event: ClerkUserEvent;

  try {
    event = webhook.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event.type !== "user.created" && event.type !== "user.updated") {
    return NextResponse.json({ received: true });
  }

  const email = getPrimaryEmail(event.data);

  if (!email) {
    return NextResponse.json({ error: "Clerk user has no email" }, { status: 400 });
  }

  const name = `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim() || email;
  const metadataRole = normalizeRole(event.data.public_metadata?.role ?? event.data.private_metadata?.role);
  const roleUpdate = metadataRole ? { role: metadataRole, isPro: metadataRole === "PRO" } : {};

  await prisma.user.upsert({
    where: { id: event.data.id },
    create: {
      id: event.data.id,
      email,
      name,
      role: metadataRole ?? UserRole.FREE,
      isPro: metadataRole === UserRole.PRO,
    },
    update: {
      email,
      name,
      ...roleUpdate,
    },
  });

  return NextResponse.json({ received: true });
}
