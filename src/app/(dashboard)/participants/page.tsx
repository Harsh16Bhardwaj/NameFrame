"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Download, RefreshCw, Search, Grid3x3, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import ProtectedPage from "@/components/protectedPage";

interface Participant {
  id: string;
  name: string;
  email: string;
  emailStatus: string;
  createdAt: string;
  event: {
    title: string;
  };
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedInsight, setSelectedInsight] = useState<"status" | "events" | "timeline">("status");

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ search: searchQuery, page: "1", limit: "100" });
      const response = await fetch(`/api/participants?${queryParams}`);
      const data = await response.json();
      if (data.success) setParticipants(data.data.participants);
      else setParticipants([]);
    } catch {
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return participants;
    return participants.filter((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.event.title.toLowerCase().includes(q));
  }, [participants, searchQuery]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const sent = participants.filter((p) => p.emailStatus === "SENT").length;
    const pending = participants.filter((p) => p.emailStatus === "PENDING").length;
    const failed = participants.filter((p) => p.emailStatus === "FAILED").length;
    
    const eventCounts = participants.reduce((acc, p) => {
      acc[p.event.title] = (acc[p.event.title] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dateGroups = participants.reduce((acc, p) => {
      const date = new Date(p.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: participants.length,
      sent,
      pending,
      failed,
      sentPercent: participants.length > 0 ? Math.round((sent / participants.length) * 100) : 0,
      eventCounts: Object.entries(eventCounts).sort((a, b) => b[1] - a[1]),
      dateGroups: Object.entries(dateGroups).sort(),
    };
  }, [participants]);

  const handleExport = async () => {
    const response = await fetch("/api/participants/export");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "participants.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <ProtectedPage>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-auto bg-zinc-950 p-6 pt-24 text-zinc-100">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="pointer-events-none absolute left-[-6rem] top-[10rem] h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white">Participants</h1>
              <p className="text-sm text-zinc-400">Search, analyze and manage participant records</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchParticipants} className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:border-teal-400 hover:text-teal-300">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button onClick={handleExport} className="inline-flex items-center gap-2 rounded-lg bg-teal-400 px-3 py-2 text-sm font-semibold text-black hover:bg-teal-300">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Insights Tabs */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <h2 className="text-lg font-semibold text-white">Insights</h2>
              <div className="flex gap-2">
                {(['status', 'events', 'timeline'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedInsight(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedInsight === tab
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-teal-500/30'
                    }`}
                  >
                    {tab === 'status' && 'Email Status'}
                    {tab === 'events' && 'By Event'}
                    {tab === 'timeline' && 'Timeline'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {selectedInsight === 'status' && (
                <div className="space-y-3">
                  {[
                    { label: 'Sent', count: analytics.sent, color: 'bg-teal-500' },
                    { label: 'Pending', count: analytics.pending, color: 'bg-amber-500' },
                    { label: 'Failed', count: analytics.failed, color: 'bg-rose-500' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-zinc-400">{item.label}</span>
                        <span className="text-sm font-semibold text-white">{item.count}</span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${analytics.total > 0 ? (item.count / analytics.total) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedInsight === 'events' && (
                <div className="space-y-2">
                  {analytics.eventCounts.slice(0, 5).map(([event, count]) => (
                    <div key={event} className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/50">
                      <span className="text-sm text-zinc-300 truncate">{event}</span>
                      <span className="text-sm font-semibold text-teal-300">{count} participants</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedInsight === 'timeline' && (
                <div className="space-y-2 max-h-64">
                  {analytics.dateGroups.map(([date, count]) => (
                    <div key={date} className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/30">
                      <span className="text-xs text-zinc-400">{date}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-zinc-800 rounded-full h-1.5">
                          <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (count / analytics.total) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-zinc-300 w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search participants..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-3 text-sm text-zinc-100 outline-none focus:border-teal-400"
            />
          </div>

          {/* View Toggle + Data Display */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition ${viewMode === 'table' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
            >
              <BarChart3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
          </div>

          {/* Table/Grid View */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            {loading ? (
              <div className="flex h-56 items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-teal-300" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center text-zinc-400">No participants found.</div>
            ) : viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead className="bg-zinc-950/60 text-zinc-400">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Event</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Created</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-t border-zinc-800 hover:bg-zinc-800/50 transition">
                        <td className="px-4 py-3 text-zinc-100">{p.name}</td>
                        <td className="px-4 py-3 text-zinc-300 text-xs">{p.email}</td>
                        <td className="px-4 py-3 text-zinc-300">{p.event.title}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${p.emailStatus === "SENT" ? "bg-teal-500/10 text-teal-300 border border-teal-500/30" : p.emailStatus === "PENDING" ? "bg-amber-500/10 text-amber-300 border border-amber-500/30" : "bg-rose-500/10 text-rose-300 border border-rose-500/30"}`}>
                            {p.emailStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => navigator.clipboard.writeText(p.email)}
                            className="inline-flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-300 hover:border-teal-500/40 hover:text-teal-300 transition text-xs"
                          >
                            <Copy className="h-3 w-3" />
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {filtered.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 hover:border-teal-500/30 transition"
                  >
                    <div className="mb-3">
                      <h3 className="font-semibold text-white">{p.name}</h3>
                      <p className="text-xs text-zinc-400">{p.email}</p>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-zinc-400">Event: <span className="text-teal-300">{p.event.title}</span></p>
                      <p className="text-xs text-zinc-400">Date: {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-2 py-1 text-xs ${p.emailStatus === "SENT" ? "bg-teal-500/10 text-teal-300" : "bg-amber-500/10 text-amber-300"}`}>
                        {p.emailStatus}
                      </span>
                      <button
                        onClick={() => navigator.clipboard.writeText(p.email)}
                        className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-teal-300 transition"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </ProtectedPage>
  );
}
