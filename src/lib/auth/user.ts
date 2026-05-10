import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma/enums";

function normalizeRole(value: unknown) {
  return value === UserRole.PRO ? UserRole.PRO : value === UserRole.FREE ? UserRole.FREE : undefined;
}

export async function ensureCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();
  const primaryEmail = clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!primaryEmail) {
    throw new Error("Authenticated Clerk user has no primary email");
  }

  const name = `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || primaryEmail;
  const metadataRole = normalizeRole(clerkUser?.publicMetadata?.role ?? clerkUser?.privateMetadata?.role);
  const roleUpdate = metadataRole ? { role: metadataRole, isPro: metadataRole === "PRO" } : {};

  return prisma.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email: primaryEmail,
      name,
      role: metadataRole ?? UserRole.FREE,
      isPro: metadataRole === UserRole.PRO,
    },
    update: {
      email: primaryEmail,
      name,
      ...roleUpdate,
    },
  });
}

export async function requireCurrentUser() {
  const user = await ensureCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export function isProUser(user: { role?: "FREE" | "PRO"; isPro?: boolean }) {
  return user.role === UserRole.PRO;
}
