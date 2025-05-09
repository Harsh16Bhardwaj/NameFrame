"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

// Import components
import TopBar from "./components/TopBar";
import KpiCards from "./components/KpiCards";
import RecentEventsTable from "./components/RecentEventsTable";
import AnalyticsCard from "./components/AnalyticsCard";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";

// Import theme type and default theme config
import type { ThemeConfig } from "@/config/theme";
import { themeConfig as defaultThemeConfig } from "@/config/theme";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { josefinFont } from "@/components/landing/Hero";

export default function Dashboard() {
  // State management
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | undefined>(
    defaultThemeConfig
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    recentParticipants: 0,
    totalCertificates: 0,
    totalEmailsSent: 0,
    recentEmailsSent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<
    {
      id: string;
      title: string;
      createdAt: string;
      participants: { emailed: boolean }[];
      template: { name: string };
    }[]
  >([]);
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Check user preference for dark mode on initial load
  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark" || (!savedTheme && prefersDark));
  }, []);

  // Update root class for dark mode to toggle CSS variables
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Select theme based on dark mode
  const theme = isDarkMode
    ? themeConfig?.dark
    : themeConfig?.light || defaultThemeConfig;

  // Fetch dashboard statistics from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/dashboard/stats");

        if (response.data.success) {
          setStats(response.data.data);
        } else {
          console.error(
            "Failed to fetch dashboard stats:",
            response.data.error
          );
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch events data from the API
  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await axios.get("/api/events");

      if (response.data.success) {
        // Make sure the data structure matches what the component expects
        const eventsData = response.data.data.map((event: any) => ({
          id: event.id,
          title: event.title || event.name,
          createdAt: event.createdAt,
          participants: Array.isArray(event.participants)
            ? event.participants
            : [],
          template: {
            name: event.template?.name || "Default Template",
          },
        }));

        setEvents(eventsData);
        setFilteredEvents(eventsData);
      } else {
        console.error("Failed to fetch events:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.template.name.toLowerCase().includes(query)
    );

    setFilteredEvents(results);
  };

  // Update filtered events when search query changes
  useEffect(() => {
    handleSearch();
  }, [searchQuery, events]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* TopBar - Fixed at the top, no scrolling */}
      <TopBar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsMobileNavOpen={setIsMobileNavOpen}
        themeConfig={theme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
      />

      {/* Main scrollable area - Add the scrollbar-themed class */}
      <div className="flex-1 p-6 overflow-y-auto onyx scrollbar-themed">
        <div className="w-full  h-10 mb-5">
          <Link href="/create">
            <div className="flex  flex-col md:flex-row   w-full px-5  justify-end gap-x-2">
              <button className={ `${josefinFont.className} visible  md:invisible text-gray-300 font-semibold`}>
                For Best Experience Switch to Web Version. Thank You...
              </button>
              <button
                className={`flex md:visible invisible cursor-pointer items-center justify-center gap-x-2 rounded-md px-6 py-2.5 font-medium text-sm transition-all duration-200 ease-in-out transform
    ${
      isDarkMode
        ? "bg-gradient-to-r from-[#1e293b] to-[#334155] text-gray-100 border border-[#475569] hover:from-[#2d3b50] hover:to-[#3b4c64] hover:shadow-md hover:scale-105"
        : "bg-gradient-to-r from-[#f9fcff] to-[#fbfdff] text-gray-800 border border-[#cbd5e1] hover:from-[#d8e0ea] hover:to-[#bfc8d7] hover:shadow-sm hover:scale-105"
    }
  `}
              >
                <Calendar className="w-4 h-4"></Calendar>
                Create Event
              </button>
            </div>
          </Link>
        </div>
        <div className="space-y-6 pb-6">
          {/* KPI Cards */}
          <KpiCards
            stats={stats}
            loading={loading}
            isDarkMode={isDarkMode}
            themeConfig={theme}
          />

          {/* Middle section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentEventsTable
                events={filteredEvents}
                loadingEvents={loadingEvents}
                isDarkMode={isDarkMode}
                themeConfig={theme}
                fetchEvents={fetchEvents}
              />
            </div>
            <AnalyticsCard
              events={filteredEvents}
              stats={stats}
              loadingEvents={loadingEvents}
              isDarkMode={isDarkMode}
              themeConfig={theme}
            />
          </div>

          {/* Bottom section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions Card */}
            <motion.div
              className="bg-[var(--dark-onyx)] rounded-2xl p-5
 shadow-lg border border-[var(--bluey-text)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-[var(--tealy-heading)] text-lg md:text-2xl font-bold p-3 text-center mb-2">
                Quick Actions
              </h2>
              <QuickActions themeConfig={theme} isDarkMode={isDarkMode} />
            </motion.div>

            {/* Recent Activity Card */}
            <motion.div
              className="bg-[var(--dark-onyx-text)] rounded-2xl p-5 shadow-lg border border-[var(--bluey-text)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-[var(--tealy-text)] text-lg md:text-xl font-bold mb-5">
                Activity Log :
              </h2>
              <RecentActivity
                events={filteredEvents}
                themeConfig={theme}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
