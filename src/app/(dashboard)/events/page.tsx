"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, Users, Clock, ChevronRight, 
  Plus, Search, Filter, RefreshCw 
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
            name: event?.name || "Unnamed Event",
            description: event?.description || "No description available",
            date: event?.date || event?.createdAt || new Date().toISOString(),
            participants: Array.isArray(event?.participants) ? event.participants : [],
            status: event?.status || "active",
            createdAt: event?.createdAt || new Date().toISOString()
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

  const filteredEvents = events.filter(event => {
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
      className="min-h-screen bg-gradient-to-r pt-24 from-[#0d172a] via-[#131f2d] to-[#101a26] text-white p-8 relative overflow-hidden"
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

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#c7b9d3] via-[#ffffff] to-[#542082] text-transparent bg-clip-text">
              Events
            </h1>
            <p className="text-[#c5c3c4]/70 mt-2">
              Manage and track all your events
            </p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#4b3a70]/30 to-[#4b3a70]/20 hover:from-[#4b3a70]/40 hover:to-[#4b3a70]/30 text-[#c5c3c4] font-medium rounded-lg transition-all flex items-center gap-2 border border-[#4b3a70] backdrop-blur-sm"
            >
              <Filter className="w-4 h-4" />
              Filters
            </motion.button>
            <Link href="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#b7a2c9] via-[#e7e7e7] to-[#a894b9] hover:from-[#c9b8d7] hover:via-[#9d8db3] hover:to-[#c9b8d7] text-[#212531] font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-[#b7a2c9]/20"
              >
                <Plus className="w-4 h-4" />
                New Event
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2  bg-gray-200 text-black backdrop-blur-sm  border-[#4b3a70]/30 rounded-lg focus:outline-none focus:border-[#b7a2c9] transition-all"
            />
          </div>
            <Search className="absolute left-3 bg-gray-200 top-1/2 transform -translate-y-1/2 text-neutral-800 w-5 h-5" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchEvents}
            className="px-4 py-3 cursor-pointer bg-gradient-to-r from-[#4b3a70]/30 to-[#4b3a70]/20 hover:from-[#4b3a70]/40 hover:to-[#4b3a70]/30 text-[#c5c3c4] font-medium rounded-lg transition-all flex items-center gap-2 border border-[#4b3a70] backdrop-blur-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group relative bg-gradient-to-br from-[#d8d8d8] via-[#3e8169] to-[#79c7ad] text-black backdrop-blur-xl rounded-lg p-6 border border-[#4b3a70]/30 shadow-lg overflow-hidden cursor-pointer"
                >
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4b3a70]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#000000] transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-[#464646] mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-[#4b3a70]/90 to-[#2a2f3d]/40">
                          <Users className="w-4 h-4 text-[#b7a2c9]" />
                        </div>
                        <div>
                          <p className="text-sm text-[#c5c3c4]/70">Participants</p>
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
                            {event.date ? new Date(event.date).toLocaleDateString() : "No date set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex justify-between items-center">
                      <span className={`px-3 bg-green-300 py-1 rounded-full text-xs ${
                        event.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
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
            <p className="text-[#c5c3c4]/70 text-lg">
              No events found
            </p>
            <p className="text-[#c5c3c4]/50 text-sm mt-1">
              Try adjusting your search or create a new event
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
} 