import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";

const getDashboardData = unstable_cache(
  async (userId: string) => {
    const events = await prisma.event.findMany({
      where: { userId },
      include: {
        participants: true,
        template: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const totalEvents = events.length;
    const totalParticipants = events.reduce(
      (sum, event) => sum + event.participants.length,
      0
    );
    const totalEmailsSent = events.reduce(
      (sum, event) => sum + event.participants.filter((p) => p.emailed).length,
      0
    );
    const totalParticipated = events.reduce(
      (sum, event) => sum + event.participants.filter((p) => p.participated).length,
      0
    );

    const attendanceRate = totalParticipants > 0
      ? Number(((totalParticipated / totalParticipants) * 100).toFixed(1))
      : 0;
    const deliveryRate = totalParticipants > 0
      ? Number(((totalEmailsSent / totalParticipants) * 100).toFixed(1))
      : 0;

    const mappedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      createdAt: event.createdAt.toISOString(),
      participants: event.participants.map((p) => ({
        email: p.email,
        name: p.name,
        emailed: p.emailed,
        participated: p.participated,
      })),
      template: { name: event.template?.name || "Default Template" },
    }));

    // Calculate unique and repeat participants
    const emailMap = new Map<string, number>();
    events.forEach((event) => {
      event.participants.forEach((p) => {
        const email = p.email.toLowerCase();
        emailMap.set(email, (emailMap.get(email) || 0) + 1);
      });
    });

    const uniqueParticipants = emailMap.size;
    const repeatParticipants = Array.from(emailMap.values()).filter((count) => count > 1).length;

    return {
      stats: {
        totalEvents,
        totalParticipants,
        uniqueParticipants,
        repeatParticipants,
        totalCertificates: totalParticipants,
        totalEmailsSent,
        totalEmailsPending: 0,
        totalEmailsFailed: 0,
        attendanceRate,
        deliveryRate,
        emailSuccessRate:
          totalParticipants > 0
            ? Math.round((totalEmailsSent / totalParticipants) * 100)
            : 0,
      },
      events: mappedEvents,
    };
  },
  ["dashboard-page-v2"],
  { revalidate: 60 }
);

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const data = await getDashboardData(userId);
  return <DashboardClient initialStats={data.stats} initialEvents={data.events} />;
}
