"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Sparkles,
  Activity,
  MailCheck,
  Users,
  Trophy,
} from "lucide-react";

import TopBar from "./components/TopBar";
import KpiCards from "./components/KpiCards";
import RecentEventsTable from "./components/RecentEventsTable";
import AnalyticsCard from "./components/AnalyticsCard";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import ProtectedPage from "@/components/protectedPage";

type DashboardStats = {
  totalEvents: number;
  totalParticipants: number;
  uniqueParticipants: number;
  repeatParticipants: number;
  totalCertificates: number;
  totalEmailsSent: number;
  totalEmailsPending: number;
  totalEmailsFailed: number;
  attendanceRate?: number;
  deliveryRate?: number;
  emailSuccessRate?: number;
};

type EventRow = {
  id: string;
  title: string;
  createdAt: string;
  participants: {
    email: string;
    name: string;
    emailed: boolean;
    participated?: boolean;
    emailStatus?: string;
  }[];
  template: { name: string };
};

type Props = {
  initialStats: DashboardStats;
  initialEvents: EventRow[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardClient({
  initialStats,
  initialEvents,
}: Props) {
  const router = useRouter();

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [stats] = useState(initialStats);
  const [events] = useState(initialEvents);

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase().trim();

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.template.name.toLowerCase().includes(query),
    );
  }, [searchQuery, events]);

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const match = events.find((event) =>
      event.title.toLowerCase().includes(query),
    );

    if (match) {
      router.push(`/events/${match.id}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const topEvent =
    filteredEvents.length > 0
      ? filteredEvents.reduce((max, event) =>
          event.participants.length > max.participants.length ? event : max,
        )
      : null;

  const avgParticipants =
    filteredEvents.length > 0
      ? Math.round(stats.totalParticipants / filteredEvents.length)
      : 0;

  return (
    <ProtectedPage>
      <main className="relative flex h-screen flex-col overflow-hidden bg-[#05060a] text-zinc-100">
        {/* Background theme layers */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-12rem] top-[-12rem] h-[28rem] w-[28rem] rounded-full bg-teal-500/5 blur-[120px]" />
          <div className="absolute right-[-10rem] top-[10rem] h-[26rem] w-[26rem] rounded-full bg-indigo-500/5 blur-[120px]" />
          <div className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-amber-500/10 blur-[140px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_25%,rgba(0,0,0,0.5))]" />
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <TopBar
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            setIsMobileNavOpen={setIsMobileNavOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            handleKeyPress={handleKeyPress}
          />

          <div className="scrollbar-themed flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6 pb-10">
              {/* Hero Header */}
              <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.45 }}
                className="relative overflow-hidden rounded-[2rem]  border border-white/10 bg-neutral-950 p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-7"
              >
                <div className="absolute inset-0" />
                <div className="absolute right-6 top-6 hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-300 backdrop-blur md:block">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_18px_rgba(45,212,191,0.9)]" />
                  Live dashboard
                </div>

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-medium text-teal-200">
                      <Sparkles className="h-3.5 w-3.5" />
                      Event Command Centre
                    </div>

                    <h1 className="max-w-3xl text-xl font-black font-mono tracking-tight text-gray-200 sm:text-4xl lg:text-3xl">
                      Manage events, emails and certificates from one powerful
                      dashboard.
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                      Track participation, delivery health, event growth and
                      audience engagement with a cleaner visual layer.
                    </p>
                  </div>

                  <Link
                    href="/create"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-300/30 bg-gradient-to-r bg-accent  px-5 py-3 text-sm font-bold text-gray-200 shadow-lg shadow-teal-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-teal-500/35 sm:w-auto"
                  >
                    <Calendar className="h-4 w-4 transition-transform group-hover:rotate-6" />
                    Create Event
                  </Link>
                </div>
              </motion.section>

              {/* KPI Cards */}
              <motion.section
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.45, delay: 0.08 }}
              >
                <KpiCards stats={stats} loading={false} isDarkMode={isDarkMode} />
              </motion.section>

              {/* Analytics + Smart Insights */}
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.45, delay: 0.16 }}
                  className="lg:col-span-2"
                >
                  <AnalyticsCard
                    events={filteredEvents}
                    stats={stats}
                    loadingEvents={false}
                    isDarkMode={isDarkMode}
                  />
                </motion.div>

                <motion.aside
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.45, delay: 0.22 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-2xl"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-300">
                        Smart Insights
                      </p>
                      <h3 className="mt-1 text-xl font-bold text-white">
                        Growth signals
                      </h3>
                    </div>

                    <div className="rounded-2xl border border-teal-400/20 bg-teal-400/10 p-3 text-teal-300">
                      <Activity className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                    {filteredEvents.length === 0 ? (
                      <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm italic text-zinc-500">
                        Create events and upload participants to unlock insights.
                      </p>
                    ) : (
                      [
                        {
                          icon: Trophy,
                          text: `${filteredEvents.length} event(s) managed. Keep expanding your reach.`,
                        },
                        {
                          icon: Users,
                          text: `${stats.uniqueParticipants} unique participants across all events.`,
                        },
                        {
                          icon: MailCheck,
                          text: `${stats.emailSuccessRate ?? 0}% email delivery success rate.`,
                        },
                        {
                          icon: Activity,
                          text: `${stats.repeatParticipants} participants attended multiple events.`,
                        },
                      ].map((item, index) => {
                        const Icon = item.icon;

                        return (
                          <div
                            key={index}
                            className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-teal-400/30 hover:bg-teal-400/[0.07]"
                          >
                            <div className="flex items-start gap-3">
                              <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-teal-300">
                                <Icon className="h-4 w-4" />
                              </div>
                              <p className="text-sm leading-5 text-zinc-300">
                                {item.text}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.aside>
              </section>

              {/* Recent Events + Email Health */}
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.45, delay: 0.28 }}
                  className="lg:col-span-2"
                >
                  <RecentEventsTable
                    events={filteredEvents}
                    loadingEvents={false}
                    isDarkMode={isDarkMode}
                    fetchEvents={() => {}}
                  />
                </motion.div>

                <motion.aside
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.45, delay: 0.34 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-2xl"
                >
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
                      Email Health
                    </p>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      Delivery overview
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {[
                      {
                        label: "Sent",
                        value: `${stats.emailSuccessRate ?? 0}%`,
                        width: stats.emailSuccessRate ?? 0,
                        bar: "from-teal-400 to-cyan-400",
                        text: "text-teal-300",
                      },
                      {
                        label: "Pending",
                        value: stats.totalEmailsPending,
                        width: stats.totalEmailsPending > 0 ? 18 : 0,
                        bar: "from-amber-400 to-orange-400",
                        text: "text-amber-300",
                      },
                      {
                        label: "Failed",
                        value: stats.totalEmailsFailed,
                        width: stats.totalEmailsFailed > 0 ? 18 : 0,
                        bar: "from-rose-400 to-red-400",
                        text: "text-rose-300",
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-zinc-400">{item.label}</span>
                          <span className={`font-bold ${item.text}`}>
                            {item.value}
                          </span>
                        </div>

                        <div className="h-2.5 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.bar} shadow-lg transition-all duration-700`}
                            style={{ width: `${Math.min(item.width, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.aside>
              </section>

              {/* Mini Insight Cards */}
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Top Event",
                    value: topEvent ? topEvent.title : "—",
                    subtext: topEvent
                      ? `${topEvent.participants.length} participants`
                      : "No events yet",
                  },
                  {
                    title: "Most Frequent",
                    value:
                      stats.repeatParticipants > 0
                        ? stats.repeatParticipants
                        : "—",
                    subtext:
                      stats.repeatParticipants > 0
                        ? "returning participants"
                        : "No repeats yet",
                  },
                  {
                    title: "Certificates",
                    value: stats.totalCertificates,
                    subtext: "Generated",
                  },
                  {
                    title: "Avg/Event",
                    value: avgParticipants,
                    subtext: "participants per event",
                  },
                ].map((widget, index) => (
                  <motion.div
                    key={widget.title}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.06 }}
                    className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/30 hover:bg-white/[0.07]"
                  >
                    <div className="mb-4 h-1 w-10 rounded-full bg-gradient-to-r from-teal-300 to-cyan-400" />
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                      {widget.title}
                    </h4>
                    <p className="line-clamp-1 text-2xl font-black text-white">
                      {widget.value}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {widget.subtext}
                    </p>
                  </motion.div>
                ))}
              </section>

              {/* Quick Actions + Activity */}
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.45, delay: 0.62 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-2xl"
                >
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-300">
                      Shortcuts
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">
                      Quick Actions
                    </h2>
                  </div>

                  <QuickActions />
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.45, delay: 0.7 }}
                  className="rounded-[1.75rem] border border-white/10 bg-white/[0.055] p-5 shadow-xl shadow-black/20 backdrop-blur-2xl"
                >
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-300">
                      Timeline
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">
                      Activity Log
                    </h2>
                  </div>

                  <RecentActivity events={filteredEvents} />
                </motion.div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </ProtectedPage>
  );
}