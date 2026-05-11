"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import TopBar from "./components/TopBar";
import KpiCards from "./components/KpiCards";
import RecentEventsTable from "./components/RecentEventsTable";
import AnalyticsCard from "./components/AnalyticsCard";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import { josefinFont } from "@/components/landing/Hero";
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
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
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
    const match = events.find((event) => event.title.toLowerCase().includes(query));
    if (match) {
      router.push(`/events/${match.id}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <ProtectedPage>
      <div className="ops-skin flex h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-100">
        <TopBar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          setIsMobileNavOpen={setIsMobileNavOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleKeyPress={handleKeyPress}
        />

        <div className="scrollbar-themed flex-1 overflow-y-auto p-6">
          <div className="mb-5 h-10 w-full">
            <div className="flex w-full flex-col justify-end gap-x-2 px-5 md:flex-row">
              <Link href="/create" className=" w-40 text-sm font-medium text-zinc-100 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-teal-500/60 hover:bg-zinc-800 hover:shadow-md">
                
                <button className="invisible w-40 flex cursor-pointer items-center justify-center gap-x-2 rounded-md border border-zinc-700 bg-zinc-900 px-6 py-2.5 text-sm font-medium text-zinc-100 transition-all duration-200 ease-in-out hover:scale-[1.02] hover:border-teal-500/60 hover:bg-zinc-800 hover:shadow-md md:visible">
                  <Calendar className="w-4 h-4" />
                  Create Event
                </button>
              </Link>
            </div>
          </div>
          <div className="space-y-6 pb-6">
            {/* Compact KPI Grid - 6 cards */}
            <KpiCards stats={stats} loading={false} isDarkMode={isDarkMode} />

            {/* Main Analytics + Smart Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AnalyticsCard
                  events={filteredEvents}
                  stats={stats}
                  loadingEvents={false}
                  isDarkMode={isDarkMode}
                />
              </div>
              
              {/* Smart Insights Panel */}
              <motion.div
                className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Smart Insights</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {filteredEvents.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">Create events and upload participants to unlock insights.</p>
                  ) : (
                    filteredEvents.slice(0, 4).map((_, i) => (
                      <div key={i} className="bg-black/20 border border-white/5 rounded-lg p-3">
                        <div className="flex gap-2 items-start">
                          <div className="w-2 h-2 rounded-full bg-teal-400 mt-1 flex-shrink-0" />
                          <p className="text-xs text-zinc-300 line-clamp-2">
                            {i === 0 && `${filteredEvents.length} event(s) managed. Keep expanding your reach!`}
                            {i === 1 && `${stats.uniqueParticipants} unique participants across all events.`}
                            {i === 2 && `${stats.emailSuccessRate}% email delivery success rate.`}
                            {i === 3 && `${stats.repeatParticipants} participants attended multiple events.`}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Recent Events + Health Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RecentEventsTable
                  events={filteredEvents}
                  loadingEvents={false}
                  isDarkMode={isDarkMode}
                  fetchEvents={() => {}}
                />
              </div>
              
              {/* Health Summary */}
              <motion.div
                className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Email Health</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-zinc-400">Sent</span>
                      <span className="text-teal-400 font-semibold">{stats.emailSuccessRate}%</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${stats.emailSuccessRate}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-zinc-400">Pending</span>
                      <span className="text-amber-400 font-semibold">{stats.totalEmailsPending}</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2">
                      <div className="bg-amber-500 h-2 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-zinc-400">Failed</span>
                      <span className="text-rose-400 font-semibold">{stats.totalEmailsFailed}</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2">
                      <div className="bg-rose-500 h-2 rounded-full" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Mini Insights Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: "Top Event",
                  value: filteredEvents.length > 0 ? (filteredEvents.reduce((max, e) => e.participants.length > max.participants.length ? e : max).title) : "—",
                  subtext: filteredEvents.length > 0 ? `${Math.max(...filteredEvents.map(e => e.participants.length))} participants` : "",
                },
                {
                  title: "Most Frequent",
                  value: stats.repeatParticipants > 0 ? stats.repeatParticipants : "—",
                  subtext: stats.repeatParticipants > 0 ? "returning participants" : "No repeats yet",
                },
                {
                  title: "Certificates",
                  value: stats.totalCertificates,
                  subtext: "Generated",
                },
                {
                  title: "Avg/Event",
                  value: filteredEvents.length > 0 ? Math.round(stats.totalParticipants / filteredEvents.length) : 0,
                  subtext: "participants per event",
                },
              ].map((widget, i) => (
                <motion.div
                  key={i}
                  className="rounded-2xl border border-white/5 bg-zinc-900/50 p-4 hover:border-teal-500/20 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">{widget.title}</h4>
                  <p className="text-2xl font-bold text-white">{widget.value}</p>
                  <p className="text-xs text-zinc-500 mt-1">{widget.subtext}</p>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 shadow-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-lg md:text-2xl font-bold p-3 text-center mb-2 text-zinc-100">
                  Quick Actions
                </h2>
                <QuickActions />
              </motion.div>

              <motion.div
                className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 shadow-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <h2 className="text-lg md:text-xl font-bold mb-5 text-zinc-100">
                  Activity Log
                </h2>
                <RecentActivity
                  events={filteredEvents}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
