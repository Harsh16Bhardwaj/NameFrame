"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight, RefreshCw, Search, Users } from "lucide-react";
import Link from "next/link";
import ProtectedPage from "@/components/protectedPage";

interface Event {
  id: string;
  title: string;
  description: string | null;
  organizationName?: string | null;
  organizationLogoUrl?: string | null;
  createdAt: string;
  participants: Array<{ id: string; emailed: boolean }>;
  status?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setEvents(
          data.data.map((event: Event) => ({
            id: event.id,
            title: event.title,
            description: event.description ?? "",
            organizationName: event.organizationName ?? "",
            organizationLogoUrl: event.organizationLogoUrl ?? "",
            createdAt: event.createdAt,
            participants: Array.isArray(event.participants) ? event.participants : [],
            status: event.status ?? "DRAFT",
          }))
        );
      } else {
        setEvents([]);
      }
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return events;
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        (event.description ?? "").toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  return (
    <ProtectedPage>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen w-full bg-zinc-950 p-6 pt-24 text-zinc-100 overflow-x-hidden"
      >
        <div className="mx-auto max-w-5xl space-y-6 relative">
          <div className="pointer-events-none absolute left-0 top-[10rem] h-56 w-56 rounded-full bg-teal-500/10 blur-3xl -translate-x-1/2" />
          <div className="pointer-events-none absolute right-0 top-[20rem] h-56 w-56 rounded-full bg-zinc-400/10 blur-3xl translate-x-1/2" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white">Events</h1>
              <p className="text-sm text-zinc-400">Track and manage certificate events</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchEvents}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 transition hover:border-teal-400 hover:text-teal-300"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-400 px-3 py-2 text-sm font-semibold text-black transition hover:bg-teal-300"
              >
                <Calendar className="h-4 w-4" />
                New Event
              </Link>
            </div>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-3 text-sm text-zinc-100 outline-none transition focus:border-teal-400"
            />
          </div>

          {loading ? (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
              <RefreshCw className="h-6 w-6 animate-spin text-teal-300" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center text-zinc-400">
              No events found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEvents.map((event, idx) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group h-full rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-teal-500/40"
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
                          {event.organizationLogoUrl ? (
                            <img src={event.organizationLogoUrl} alt="Organization logo" className="h-full w-full object-cover" />
                          ) : (
                            <Users className="h-4 w-4 text-zinc-400" />
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-zinc-100">{event.title}</h2>
                          <p className="text-sm text-zinc-400">{event.organizationName || "Organization"}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-zinc-500 transition group-hover:text-teal-300" />
                    </div>
                    <p className="mb-4 line-clamp-2 text-sm text-zinc-400">
                      {event.description || "No description added."}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-5 text-sm">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Users className="h-4 w-4 text-teal-300" />
                        {event.participants.length} participants
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </ProtectedPage>
  );
}
