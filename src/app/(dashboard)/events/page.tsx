"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Clock,
  ChevronRight,
  Plus,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  participants: {
    id: string;
    name: string;
    email: string;
    eventId: string;
    certificateUrl: string | null;
    emailed: boolean;
    createdAt: string;
  }[];
  status: string;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/events");
      const data = await response.json();
      console.log("API Response:", data); // Debug log

      if (data.success && Array.isArray(data.data)) {
        // Transform the data to match our interface with proper null checks
        const transformedEvents = data.data.map((event: any) => {
          console.log("Processing event:", event); // Debug log
          return {
            id: event?.id || "",
            name: event?.title || "Unnamed Event",
            description: event?.description || "No description available",
            date: event?.date || event?.createdAt || new Date().toISOString(),
            participants: Array.isArray(event?.participants)
              ? event.participants
              : [],
            status: event?.status || "active",
            createdAt: event?.createdAt || new Date().toISOString(),
          };
        });
        console.log("Transformed events:", transformedEvents); // Debug log
        setEvents(transformedEvents);
      } else {
        console.error("Invalid data format:", data); // Debug log
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (!event) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      (event.name?.toLowerCase() || "").includes(searchLower) ||
      (event.description?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-r pt-20 from-[var(--bluey-hover)] via-[var(--dark-onyx)] to-[var(--bluey-hover)] text-white p-8 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#4b3a70]/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tr from-[#b7a2c9]/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex  justify-between items-center mb-8"
        >
          <div className="w-full ">
            <h1 className="text-5xl w-full text-center font-bold bg-gradient-to-br from-[#aa8ac7] via-[#ffffff] to-[#491974] text-transparent bg-clip-text">
              Your Events
            </h1>
            <p className="text-[var(--tealy-heading)] text-center mt-2">
              Manage and track all your events at once place..
            </p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="flex gap-x-2 mb-8 mx-40">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border-2  bg-gray-300 text-black backdrop-blur-sm  border-[#4b3a70]/30 rounded-lg focus:outline-none focus:border-[#b7a2c9] transition-all"
            />
          </div>

          <div className="flex gap-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchEvents}
              className="px-3 py-2 cursor-pointer bg-gradient-to-r from-[#4b3a70]/30 to-[#4b3a70]/20 hover:from-[#4b3a70]/40 hover:to-[#4b3a70]/30 text-[#c5c3c4] font-medium rounded-lg transition-all flex items-center gap-2 border border-[var(--bluey)] backdrop-blur-sm"
            >
              <RefreshCw className="w-4 h-4" />
              
            </motion.button>
            <button
              className={`flex cursor-pointer items-center justify-center gap-x-1 rounded-md px-3 py-2 font-medium text-sm transition-all duration-200 ease-in-out transform
                ${
                  1
                    ? "bg-gradient-to-r from-[#1e293b] to-[#334155] text-gray-100 border border-[#475569] hover:from-[#2d3b50] hover:to-[#3b4c64] hover:shadow-md hover:scale-105"
                    : "bg-gradient-to-r from-[#f9fcff] to-[#fbfdff] text-gray-800 border border-[#cbd5e1] hover:from-[#d8e0ea] hover:to-[#bfc8d7] hover:shadow-sm hover:scale-105"
                }
              `}
            >
              <Calendar className="w-4 h-4"></Calendar>
              New 
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-8 h-8 text-[#b7a2c9]" />
            </motion.div>
          </div>
        ) : (
          <div className="grid max-w-5xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-gradient-to-br from-slate-900 to-slate-950 text-black backdrop-blur-xl rounded-lg p-6 border border-[#4b3a70]/30 shadow-lg overflow-hidden cursor-pointer"
                >
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4b3a70]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-gray-300 mb-2 group-hover:text-gray-200transition-colors">
                      {event.name}
                    </h3>
                    <div className="border-b border-gray-500"></div>
                    <p className="text-[#959595] mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#4b3a70]/90 to-[#2a2f3d]/40">
                          <Users className="w-4 h-4 text-[#b7a2c9]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#c5c3c4]/70">
                            Participants
                          </p>
                          <p className="text-lg font-semibold text-white">
                            {event.participants?.length || 0}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#4b3a70]/90 to-[#2a2f3d]/40">
                          <Calendar className="w-4 h-4 text-[#b7a2c9]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#c5c3c4]/70">Date</p>
                          <p className="text-lg font-semibold text-white">
                            {event.date
                              ? new Date(event.date).toLocaleDateString()
                              : "No date set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 bg-green-300 py-1 rounded-full text-xs ${
                          event.status === "active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {event.status || "unknown"}
                      </span>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5 text-[#b7a2c9]" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#c5c3c4]/70 text-lg">No events found</p>
            <p className="text-[#c5c3c4]/50 text-sm mt-1">
              Try adjusting your search or create a new event
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
