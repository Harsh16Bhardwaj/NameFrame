"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  LineChart,
  Users,
  Award,
  Mail,
  ChevronRight,
  ChevronDown,
  Calendar,
  Search,
  Bell,
  Sun,
  Moon,
  X,
  Menu,
  ArrowUpRight,
  Sliders,
  Settings,
  FileText,
  Grid,
  Home,
  LogOut,
  FileType, // Add this import to use instead of Templates
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

// Dashboard data - would typically come from API
const dashboardData = {
  kpis: [
    { title: "Total Events", value: 28, change: +12, icon: Calendar },
    { title: "Total Participants", value: 1284, change: +287, icon: Users },
    { title: "Certificates Generated", value: 892, change: +146, icon: Award },
    { title: "Emails Sent", value: 871, change: +143, icon: Mail },
  ],
  events: [
    {
      id: 1,
      name: "Annual Conference 2024",
      date: "2024-04-15",
      participants: 142,
      template: "Professional Blue",
      status: "Completed",
    },
    {
      id: 2,
      name: "Leadership Workshop",
      date: "2024-04-22",
      participants: 38,
      template: "Executive Gold",
      status: "In Progress",
    },
    {
      id: 3,
      name: "Tech Bootcamp Spring",
      date: "2024-05-01",
      participants: 86,
      template: "Modern Gradient",
      status: "Scheduled",
    },
    {
      id: 4,
      name: "Marketing Seminar",
      date: "2024-05-10",
      participants: 52,
      template: "Creative Purple",
      status: "In Progress",
    },
    {
      id: 5,
      name: "Employee Onboarding",
      date: "2024-05-18",
      participants: 16,
      template: "Corporate Clean",
      status: "Scheduled",
    },
  ],
  weeklyUploads: [12, 18, 24, 16, 28, 32, 26],
  emailDelivery: {
    success: [92, 94, 91, 95, 96, 93, 97],
    failed: [8, 6, 9, 5, 4, 7, 3],
  },
  certificateTemplates: [
    {
      id: 1,
      name: "Professional Blue",
      preview: "/templates/professional-blue.jpg",
    },
    { id: 2, name: "Executive Gold", preview: "/templates/executive-gold.jpg" },
    {
      id: 3,
      name: "Modern Gradient",
      preview: "/templates/modern-gradient.jpg",
    },
    {
      id: 4,
      name: "Creative Purple",
      preview: "/templates/creative-purple.jpg",
    },
    {
      id: 5,
      name: "Corporate Clean",
      preview: "/templates/corporate-clean.jpg",
    },
  ],
};

// Sparkline component
//@ts-ignore
const Sparkline = ({ data, color, height = 30, width = 80 }) => {
  const points = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const step = width / (data.length - 1);
    //@ts-ignore
    return data.map((value, i) => ({
      x: i * step,
      y: height - ((value - min) / range) * height,
    }));
  }, [data, height, width]);

  const pathData = useMemo(() => {
    if (points.length === 0) return "";

    const d = points       //@ts-ignore
      .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    return d;
  }, [points]);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Bar chart component
//@ts-ignore

const BarChart = ({ data, color, height = 200, width = 300 }) => {
  const max = Math.max(...data);
  const barWidth = Math.floor((width - (data.length - 1) * 10) / data.length);

  return (
    <svg width={width} height={height} className="overflow-visible">
      {
        //@ts-ignore

        data.map((value, index) => {
          const barHeight = Math.max(4, (value / max) * height);
          return (
            <motion.rect
              key={index}
              x={index * (barWidth + 10)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              fill={color}
              initial={{ height: 0, y: height }}
              animate={{ height: barHeight, y: height - barHeight }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              rx={3}
              opacity={0.7}
              className="hover:opacity-100 transition-opacity"
            />
          );
        })
      }
    </svg>
  );
};

// Line chart component
//@ts-ignore

const LineChart2 = ({ data, color, height = 200, width = 300 }) => {
  const max = Math.max(...data);
  const step = width / (data.length - 1);
  //@ts-ignore

  const points = data.map((value, i) => ({
    x: i * step,
    y: height - (value / max) * height,
  }));
  //@ts-ignore
  const pathData = points       //@ts-ignore
    .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5 }}
      />

      {
        //@ts-ignore
        points.map((point, index) => (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.5 + index * 0.1 }}
            className="hover:r-5 transition-all"
          />
        ))
      }
    </svg>
  );
};

type SearchResult = {
  id: string;
  name: string;
  date?: string;
  participants?: number;
  template?: string;
  status?: string;
  preview?: string;
};

interface Event {
  id: string;
  title: string;
  createdAt: string;
  template?: {
    name: string;
  };
  participants: {
    id: string;
    name: string;
    email: string;
    emailed: boolean;
  }[];
}

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [namePosition, setNamePosition] = useState({ x: 50, y: 60 }); // % values
  const [zoom, setZoom] = useState(1);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    recentParticipants: 0,
    totalCertificates: 0,
    totalEmailsSent: 0,
    recentEmailsSent: 0
  });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/stats');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (data.success) {
          setEvents(data.data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // Search handler function
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Search through events and templates
    const results: SearchResult[] = [
      ...dashboardData.events.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.template.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      ...dashboardData.certificateTemplates.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ];

    setSearchResults(results);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // For demo purposes - resize sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Calendar, label: "Events", href: "/events" },
    { icon: FileType, label: "Templates", href: "/templates" }, // Changed Templates to FileType
    { icon: Users, label: "Participants", href: "/participants" },
  ];

  return (
    <div className="flex h-screen bg-[#212531] text-[#c5c3c4] overflow-hidden">
      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`bg-[#322f42] fixed lg:relative z-40 mr-2 h-full shadow-xl flex flex-col`}
        initial={false}
        animate={{
          width: isSidebarCollapsed ? "80px" : "220px",
          x: isMobileNavOpen || !isSidebarCollapsed ? 0 : -80,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="flex items-center p-4 h-16 border-b border-[#4b3a70]/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#b7a2c9] to-[#8b7ba1] flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5 text-[#212531]" />
            </div>
            <motion.span
              className="font-bold text-lg tracking-tight whitespace-nowrap"
              animate={{
                opacity: isSidebarCollapsed ? 0 : 1,
                x: isSidebarCollapsed ? -40 : 0,
              }}
            >
              NameFrame
            </motion.span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto scrollbar-thin">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg overflow-hidden ${
                item.active
                  ? "bg-[#4b3a70]/20 text-white border-l-2 border-[#b7a2c9]"
                  : "hover:bg-[#4b3a70]/10 text-[#c5c3c4]"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${item.active ? "text-[#b7a2c9]" : ""}`}
              />
              <motion.span
                className="whitespace-nowrap"
                animate={{
                  opacity: isSidebarCollapsed ? 0 : 1,
                  x: isSidebarCollapsed ? -40 : 0,
                }}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Profile/Logout */}
        <div className="p-3 border-t border-[#4b3a70]/30">
          <Link
            href="/logout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#4b3a70]/10 text-[#c5c3c4]"
          >
            <LogOut className="w-5 h-5" />
            <motion.span
              className="whitespace-nowrap"
              animate={{
                opacity: isSidebarCollapsed ? 0 : 1,
                x: isSidebarCollapsed ? -40 : 0,
              }}
            >
              Logout
            </motion.span>
          </Link>
        </div>

        {/* Collapse Button */}
        <button
          className="absolute top-1/2 -right-3 w-6 h-12 bg-[#322f42] rounded-r-md flex items-center justify-center hidden lg:flex"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform ${
              isSidebarCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden pr-20">
        {/* Top Bar */}
        <div className="h-20 py-4 bg-[#322f42]/90 mt-24 rounded-2xl backdrop-blur-sm border-b border-[#4b3a70]/30 flex items-center justify-between px-4 gap-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg lg:hidden hover:bg-[#4b3a70]/20 transition-colors"
              onClick={() => setIsMobileNavOpen(true)}
              title="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-white hidden sm:block">
              Dashboard
            </h1>
          </div>

          {/* Middle section - Search */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="flex items-center bg-[#4b3a70]/30 rounded-lg px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#b7a2c9]/50">
              <Search className="w-4 h-4 text-[#c5c3c4]/70" />
              <input
                type="text"
                placeholder="Search events, templates..."
                className="bg-transparent border-none focus:outline-none focus:ring-0 w-full px-2 text-sm text-[#c5c3c4]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className="ml-2 p-1.5 rounded-md hover:bg-[#4b3a70]/20 text-[#c5c3c4] transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg hover:bg-[#4b3a70]/20 transition-colors"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              className="p-2 rounded-lg hover:bg-[#4b3a70]/20 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            <Link
              href="/create"
              className="px-4 py-2 bg-[#b7a2c9] hover:bg-[#c9b8d7] text-[#212531] font-medium rounded-lg transition-colors flex items-center gap-2"
              title="Create New Event"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Event</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <motion.div
              className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-[#4b3a70]/20">
                  <Calendar className="w-5 h-5 text-[#b7a2c9]" />
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{stats.recentParticipants}</span>
                </div>
              </div>
              <h3 className="text-[#c5c3c4]/70 text-sm font-medium mb-1">
                Total Events
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">
                  {loading ? '...' : stats.totalEvents.toLocaleString()}
                </span>
                <div className="h-8 flex items-end">
                  <Sparkline
                    data={[5, 15, 8, 12, 18, 10, 18, 5, 20, 8, 12, 10]}
                    color="#b7a2c9"
                    height={30}
                    width={80}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-[#4b3a70]/20">
                  <Users className="w-5 h-5 text-[#b7a2c9]" />
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{stats.recentParticipants}</span>
                </div>
              </div>
              <h3 className="text-[#c5c3c4]/70 text-sm font-medium mb-1">
                Total Participants
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">
                  {loading ? '...' : stats.totalParticipants.toLocaleString()}
                </span>
                <div className="h-8 flex items-end">
                  <Sparkline
                    data={[5, 15, 8, 12, 18, 10, 18, 5, 20, 8, 12, 10]}
                    color="#b7a2c9"
                    height={30}
                    width={80}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-[#4b3a70]/20">
                  <Award className="w-5 h-5 text-[#b7a2c9]" />
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{stats.recentParticipants}</span>
                </div>
              </div>
              <h3 className="text-[#c5c3c4]/70 text-sm font-medium mb-1">
                Certificates Generated
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">
                  {loading ? '...' : stats.totalCertificates.toLocaleString()}
                </span>
                <div className="h-8 flex items-end">
                  <Sparkline
                    data={[5, 15, 8, 12, 18, 10, 18, 5, 20, 8, 12, 10]}
                    color="#b7a2c9"
                    height={30}
                    width={80}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-[#4b3a70]/20">
                  <Mail className="w-5 h-5 text-[#b7a2c9]" />
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <ArrowUpRight className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">+{stats.recentEmailsSent}</span>
                </div>
              </div>
              <h3 className="text-[#c5c3c4]/70 text-sm font-medium mb-1">
                Emails Sent
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white">
                  {loading ? '...' : stats.totalEmailsSent.toLocaleString()}
                </span>
                <div className="h-8 flex items-end">
                  <Sparkline
                    data={[5, 15, 8, 12, 18, 10, 18, 5, 20, 8, 12, 10]}
                    color="#b7a2c9"
                    height={30}
                    width={80}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Second Row - Tables and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events Table */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30 h-full min-h-[384px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-semibold text-white">
                    Recent Events
                  </h2>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/events"
                      className="text-sm font-medium flex items-center gap-1 text-[#b7a2c9] hover:text-[#c9b8d7] transition-colors"
                      title="View All Events"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 rounded-lg hover:bg-[#4b3a70]/20 transition-colors"
                      title="Refresh Events"
                      onClick={() => fetchEvents()}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#4b3a70]/30">
                        <th className="text-left pb-3 text-sm font-medium text-[#c5c3c4]/70">
                          Event Name
                        </th>
                        <th className="text-left pb-3 text-sm font-medium text-[#c5c3c4]/70 hidden sm:table-cell">
                          Date
                        </th>
                        <th className="text-left pb-3 text-sm font-medium text-[#c5c3c4]/70 hidden sm:table-cell">
                          Participants
                        </th>
                        <th className="text-left pb-3 text-sm font-medium text-[#c5c3c4]/70 hidden md:table-cell">
                          Template
                        </th>
                        <th className="text-left pb-3 text-sm font-medium text-[#c5c3c4]/70">
                          Status
                        </th>
                        <th className="text-right pb-3 text-sm font-medium text-[#c5c3c4]/70">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingEvents ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-[#c5c3c4]/70">
                            Loading events...
                          </td>
                        </tr>
                      ) : events.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-[#c5c3c4]/70">
                            No events found
                          </td>
                        </tr>
                      ) : (
                        events.slice(0, 5).map((event) => {
                          const totalParticipants = event.participants.length;
                          const emailsSent = event.participants.filter(p => p.emailed).length;
                          const status = totalParticipants === emailsSent ? 'Completed' :
                                       emailsSent > 0 ? 'In Progress' : 'Scheduled';

                          return (
                            <tr
                              key={event.id}
                              className="hover:bg-[#3a3c4a] transition-colors"
                            >
                              <td className="py-3 pl-1 text-sm font-medium">
                                {event.title}
                              </td>
                              <td className="py-3 text-sm hidden sm:table-cell">
                                {new Date(event.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 text-sm hidden sm:table-cell">
                                {totalParticipants}
                              </td>
                              <td className="py-3 text-sm hidden md:table-cell">
                                {event.template?.name?.slice(0, 10) || 'No template'}
                              </td>
                              <td className="py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    status === "Completed"
                                      ? "bg-green-900/20 text-green-400"
                                      : status === "In Progress"
                                      ? "bg-blue-900/20 text-blue-400"
                                      : "bg-orange-900/20 text-orange-400"
                                  }`}
                                >
                                  {status}
                                </span>
                              </td>
                              <td className="py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/events/${event.id}`}
                                    className="p-1.5 rounded-md hover:bg-[#4b3a70]/20 text-[#c5c3c4]"
                                  >
                                    <FileText className="w-4 h-4" />
                                  </Link>
                                  <button
                                    className="p-1.5 rounded-md hover:bg-[#4b3a70]/20 text-[#c5c3c4]"
                                    onClick={() => {/* Handle email action */}}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>
                                  <button
                                    className="p-1.5 rounded-md hover:bg-[#4b3a70]/20 text-[#c5c3c4]"
                                    onClick={() => {/* Handle settings action */}}
                                  >
                                    <Sliders className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Analytics */}
            <div>
              <motion.div
                className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-semibold text-white">
                    Analytics
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs bg-[#4b3a70]/30 text-[#c5c3c4] px-2 py-1 rounded-md hover:bg-[#4b3a70]/40 transition-colors"
                      title="View Weekly Analytics"
                    >
                      Week
                    </button>
                    <button
                      className="text-xs hover:bg-[#4b3a70]/20 text-[#c5c3c4]/70 px-2 py-1 rounded-md transition-colors"
                      title="View Monthly Analytics"
                    >
                      Month
                    </button>
                    <button
                      className="text-xs hover:bg-[#4b3a70]/20 text-[#c5c3c4]/70 px-2 py-1 rounded-md transition-colors"
                      title="View Yearly Analytics"
                    >
                      Year
                    </button>
                  </div>
                </div>

                {/* Event Completion Rate */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-[#c5c3c4]/70 flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" /> Event Completion Rate
                    </h3>
                    <span className="text-xs text-[#c5c3c4]/70">
                      {events.reduce((sum, event) => {
                        const total = event.participants.length;
                        const completed = event.participants.filter(p => p.emailed).length;
                        return sum + (total > 0 ? Math.round((completed / total) * 100) : 0);
                      }, 0) / events.length || 0}% Avg
                    </span>
                  </div>
                  <div className="px-3">
                    <BarChart
                      data={events.map(event => {
                        const total = event.participants.length;
                        const completed = event.participants.filter(p => p.emailed).length;
                        return total > 0 ? Math.round((completed / total) * 100) : 0;
                      })}
                      color="#b7a2c9"
                      height={120}
                      width={300}
                    />
                    <div className="flex justify-between mt-1 text-xs text-[#c5c3c4]/70">
                      {events.slice(0, 5).map((event, index) => (
                        <span key={index} title={event.title}>{event.title.slice(0, 3)}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email Delivery Success Rate */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-[#c5c3c4]/70 flex items-center gap-1">
                      <LineChart className="w-4 h-4" /> Email Delivery Success
                    </h3>
                    <span className="text-xs text-[#c5c3c4]/70">
                      {events.reduce((sum, event) => {
                        const total = event.participants.length;
                        const sent = event.participants.filter(p => p.emailed).length;
                        return sum + (total > 0 ? Math.round((sent / total) * 100) : 0);
                      }, 0) / events.length || 0}% Avg
                    </span>
                  </div>
                  <div className="px-3">
                    <LineChart2
                      data={events.map(event => {
                        const total = event.participants.length;
                        const sent = event.participants.filter(p => p.emailed).length;
                        return total > 0 ? Math.round((sent / total) * 100) : 0;
                      })}
                      color="#7dc896"
                      height={120}
                      width={300}
                    />
                    <div className="flex justify-between mt-1 text-xs text-[#c5c3c4]/70">
                      {events.slice(0, 5).map((event, index) => (
                        <span key={index} title={event.title}>{event.title.slice(0, 3)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Third Row - Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <motion.div
              className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-lg font-semibold text-white mb-5">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/events/new"
                  className="p-4 bg-[#4b3a70]/20 rounded-xl hover:bg-[#4b3a70]/30 transition-colors flex flex-col items-center gap-2"
                  title="Create a New Event"
                >
                  <Calendar className="w-6 h-6 text-[#b7a2c9]" />
                  <span className="text-sm font-medium">New Event</span>
                </Link>
                <Link
                  href="/templates"
                  className="p-4 bg-[#4b3a70]/20 rounded-xl hover:bg-[#4b3a70]/30 transition-colors flex flex-col items-center gap-2"
                  title="Manage Templates"
                >
                  <FileType className="w-6 h-6 text-[#b7a2c9]" />
                  <span className="text-sm font-medium">Templates</span>
                </Link>
                <Link
                  href="/participants"
                  className="p-4 bg-[#4b3a70]/20 rounded-xl hover:bg-[#4b3a70]/30 transition-colors flex flex-col items-center gap-2"
                  title="Manage Participants"
                >
                  <Users className="w-6 h-6 text-[#b7a2c9]" />
                  <span className="text-sm font-medium">Participants</span>
                </Link>
                <Link
                  href="/settings"
                  className="p-4 bg-[#4b3a70]/20 rounded-xl hover:bg-[#4b3a70]/30 transition-colors flex flex-col items-center gap-2"
                  title="Settings"
                >
                  <Settings className="w-6 h-6 text-[#b7a2c9]" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-lg font-semibold text-white mb-5">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 bg-[#4b3a70]/10 rounded-lg hover:bg-[#4b3a70]/20 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-[#4b3a70]/20">
                      <Calendar className="w-4 h-4 text-[#b7a2c9]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-white">{event.title}</h3>
                        <span className="text-xs text-[#c5c3c4]/70">
                          {new Date(event.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#c5c3c4]/70 mt-1">
                        {event.participants.length} participants • {event.participants.filter(p => p.emailed).length} certificates sent
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
