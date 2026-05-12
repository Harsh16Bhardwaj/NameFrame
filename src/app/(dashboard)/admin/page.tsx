import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import AdminAnalyticsClient from "./AdminAnalyticsClient";

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const cookieStore = await cookies();
  const pass = cookieStore.get("dev_admin_auth")?.value;
  if (pass !== "ok") redirect("/analytics-dev");

  const [users, events] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      take: 100,
    }),
    prisma.event.findMany({
      orderBy: { createdAt: "desc" },
      include: { participants: { select: { id: true } } },
      take: 100,
    }),
  ]);

  const mappedUsers = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));
  const mappedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    organizationName: e.organizationName,
    createdAt: e.createdAt.toISOString(),
    participants: e.participants.length,
  }));

  return <AdminAnalyticsClient users={mappedUsers} events={mappedEvents} />;
}
