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

export default function Dashboard({
  isDarkMode,
  setIsDarkMode,
  setIsMobileNavOpen,
  themeConfig,
}: {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  setIsMobileNavOpen: (value: boolean) => void;
  themeConfig?: ThemeConfig;
}) {
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

  // Fetch dashboard statistics from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/dashboard/stats');
        
        if (response.data.success) {
          setStats(response.data.data);
        } else {
          console.error("Failed to fetch dashboard stats:", response.data.error);
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
      const response = await axios.get('/api/events');
      
      if (response.data.success) {
        // Make sure the data structure matches what the component expects
        const eventsData = response.data.data.map((event: any) => ({
          id: event.id,
          title: event.title || event.name,
          createdAt: event.createdAt,
          participants: Array.isArray(event.participants) ? event.participants : [],
          template: {
            name: event.template?.name || 'Default Template'
          }
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

  // Use default theme config if not provided from props
  const theme = themeConfig || defaultThemeConfig;

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
      <div className="flex-1 p-6 overflow-y-auto scrollbar-themed">
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
              className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-lg border border-[var(--border-color)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-[var(--text-primary)] text-lg font-semibold mb-5">
                Quick Actions
              </h2>
              <QuickActions themeConfig={theme} isDarkMode={isDarkMode} />
            </motion.div>

            {/* Recent Activity Card */}
            <motion.div
              className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-lg border border-[var(--border-color)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-[var(--text-primary)] text-lg font-semibold mb-5">
                Recent Activity
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
