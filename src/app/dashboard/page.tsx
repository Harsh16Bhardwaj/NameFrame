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

// Theme configuration
const themeConfig = {
  dark: {
    background: "bg-gradient-to-br from-[#1a1c2e] via-[#2a2d42] to-[#3a3c4a]",
    sidebar: "bg-gradient-to-b from-[#2a2d42] to-[#1a1c2e]",
    card: "bg-[#2a2d42]",
    text: {
      primary: "text-white",
      secondary: "text-[#c5c3c4]",
      accent: "text-[#b7a2c9]",
    },
    border: "border-[#4b3a70]",
    hover: {
      card: "hover:bg-[#3a3c4a]",
      button: "hover:bg-[#4b3a70]/20",
    },
    gradient: {
      text: "bg-gradient-to-r from-[#b7a2c9] to-[#8b7ba1]",
      button: "bg-gradient-to-r from-[#b7a2c9] to-[#8b7ba1]",
    },
  },
  light: {
    background: "bg-gradient-to-br from-[#f0f4ff] via-[#e6e9ff] to-[#f5f7ff]",
    sidebar: "bg-gradient-to-b from-[#e6e9ff] to-[#d6d9ff]",
    card: "bg-white",
    text: {
      primary: "text-[#2a2d42]",
      secondary: "text-[#4b3a70]",
      accent: "text-[#8b7ba1]",
    },
    border: "border-[#d6d9ff]",
    hover: {
      card: "hover:bg-[#f0f4ff]",
      button: "hover:bg-[#e6e9ff]",
    },
    gradient: {
      text: "bg-gradient-to-r from-[#8b7ba1] to-[#6b5b95]",
      button: "bg-gradient-to-r from-[#8b7ba1] to-[#6b5b95]",
    },
  },
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
    <div className={`flex pb-20  ${themeConfig[isDarkMode ? 'dark' : 'light'].background} ${themeConfig[isDarkMode ? 'dark' : 'light'].text.primary} overflow-hidden transition-all duration-500`}>
      {/* Mobile Nav Overlay */}

      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 ${isDarkMode ? 'bg-black/50' : 'bg-black/30'} z-30 lg:hidden backdrop-blur-sm`}
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`${themeConfig[isDarkMode ? 'dark' : 'light'].sidebar} fixed lg:relative z-40 mr-2 h-screen shadow-xl flex flex-col border-r ${themeConfig[isDarkMode ? 'dark' : 'light'].border}/30`}
        initial={false}
        animate={{
          width: isSidebarCollapsed ? "80px" : "220px",
          x: isMobileNavOpen || !isSidebarCollapsed ? 0 : -80,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className={`flex items-center p-4 h-16 border-b ${themeConfig[isDarkMode ? 'dark' : 'light'].border}/30`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <motion.div 
              className={`w-8 h-8 rounded-md ${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.button} flex items-center justify-center flex-shrink-0`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Award className={`w-5 h-5 ${isDarkMode ? 'text-[#212531]' : 'text-white'}`} />
            </motion.div>
            <motion.span
              className={`font-bold text-lg tracking-tight whitespace-nowrap ${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.text} bg-clip-text text-transparent`}
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
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg overflow-hidden transition-all duration-300 ${
                item.active
                  ? `${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.button} text-white border-l-2 ${themeConfig[isDarkMode ? 'dark' : 'light'].border}`
                  : `${themeConfig[isDarkMode ? 'dark' : 'light'].hover.button} ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary}`
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <item.icon
                  className={`w-5 h-5 ${item.active ? themeConfig[isDarkMode ? 'dark' : 'light'].text.accent : 'group-hover:' + themeConfig[isDarkMode ? 'dark' : 'light'].text.accent}`}
                />
              </motion.div>
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

        {/* Collapse Button */}
        <motion.button
          className={`absolute top-1/2 -right-3 w-6 h-12 ${themeConfig[isDarkMode ? 'dark' : 'light'].card} rounded-r-md flex items-center justify-center hidden lg:flex`}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight
            className={`w-4 h-4 transition-transform duration-300 ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} ${
              isSidebarCollapsed ? "" : "rotate-180"
            }`}
          />
        </motion.button>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden pr-20">
        {/* Top Bar */}
        <motion.div 
          className={`h-20 py-4 ${themeConfig[isDarkMode ? 'dark' : 'light'].card}/90 mt-24 rounded-2xl backdrop-blur-sm border ${themeConfig[isDarkMode ? 'dark' : 'light'].border}/30 flex items-center justify-between px-4 gap-4`}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left section */}
          <div className="flex items-center gap-3">
            <motion.button
              className={`p-2 rounded-lg ${themeConfig[isDarkMode ? 'dark' : 'light'].hover.button} transition-colors`}
              onClick={() => setIsMobileNavOpen(true)}
              title="Open Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className={`w-5 h-5 ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary}`} />
            </motion.button>
            <h1 className={`text-3xl font-bold ${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.text} bg-clip-text text-transparent hidden sm:block`}>
              Dashboard
            </h1>
          </div>

          {/* Middle section - Search */}
          <div className="flex-1 max-w-lg hidden md:block">
            <motion.div 
              className={`flex bg-neutral-900  items-center ${themeConfig[isDarkMode ? 'dark' : 'light'].card}/30 rounded-lg px-2 pl-3 py-1.5 focus-within:ring-1 focus-within:ring-${themeConfig[isDarkMode ? 'dark' : 'light'].text.accent}/50 transition-all duration-300`}
              whileHover={{ scale: 1.02 }}
            >
              <Search className={`w-4 h-4 ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary}/70`} />
              <input
                type="text"
                placeholder="Search events, templates..."
                className={` border-none focus:outline-none focus:ring-0 w-full px-2 text-sm ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} placeholder-${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary}/50`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <motion.button
                onClick={handleSearch}
                className={`ml-3 p-1.5 bg-teal-800 rounded-md ${themeConfig[isDarkMode ? 'dark' : 'light'].hover.button} ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} transition-colors`}
                title="Search"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4" />
              </motion.button>
            </motion.div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <motion.button
              className={`p-2 rounded-lg ${themeConfig[isDarkMode ? 'dark' : 'light'].hover.button} transition-colors`}
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDarkMode ? <Sun className={`w-5 h-5 ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary}`} /> : <Moon className={`w-5 h-5 ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary}`} />}
            </motion.button>
            <motion.button
              className={`p-2 rounded-lg ${themeConfig[isDarkMode ? 'dark' : 'light'].hover.button} transition-colors`}
              title="Notifications"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className={`w-5 h-5 ${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary}`} />
            </motion.button>
            <Link
              href="/create"
              className={`px-4 py-2 ${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.button} hover:from-[#c9b8d7] hover:to-[#9b8ab1] ${isDarkMode ? 'text-[#212531]' : 'text-white'} font-medium rounded-lg transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Event</span>
            </Link>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {dashboardData.kpis.map((kpi, index) => (
              <motion.div
                key={index}
                className={`${themeConfig[isDarkMode ? 'dark' : 'light'].card} rounded-2xl p-5 shadow-lg border ${themeConfig[isDarkMode ? 'dark' : 'light'].border}/30 backdrop-blur-sm`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg ${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.button}/20`}>
                    <kpi.icon className={`w-5 h-5 ${themeConfig[isDarkMode ? 'dark' : 'light'].text.accent}`} />
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                    <span className="text-green-500">+{kpi.change}</span>
                  </div>
                </div>
                <h3 className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-sm font-medium mb-1`}>
                  {kpi.title}
                </h3>
                <div className="flex items-end justify-between">
                  <span className={`text-2xl font-bold ${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.text} bg-clip-text text-transparent`}>
                    {kpi.value.toLocaleString()}
                  </span>
                  <div className="h-8 flex items-end">
                    <Sparkline
                      data={[5, 15, 8, 12, 18, 10, 18, 5, 20, 8, 12, 10]}
                      color={isDarkMode ? "#b7a2c9" : "#8b7ba1"}
                      height={30}
                      width={80}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Second Row - Tables and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
            {/* Events Table */}
            <div className="lg:col-span-2">
              <motion.div
                className={`${themeConfig[isDarkMode ? 'dark' : 'light'].card} rounded-2xl p-5 shadow-lg border ${themeConfig[isDarkMode ? 'dark' : 'light'].border}/30 h-full min-h-[384px]`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.primary} text-lg font-semibold`}>
                    Recent Events
                  </h2>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/events"
                      className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.accent} text-sm font-medium flex items-center gap-1 transition-colors`}
                      title="View All Events"
                    >
                      View All <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      className={`p-2 rounded-lg ${themeConfig[isDarkMode ? 'dark' : 'light'].hover.button} transition-colors`}
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
                      <tr className={`${themeConfig[isDarkMode ? 'dark' : 'light'].border} border-b `}>
                        <th className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-left pb-3 text-sm font-medium`}>
                          Event Name
                        </th>
                        <th className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-left pb-3 text-sm font-medium hidden sm:table-cell`}>
                          Date
                        </th>
                        <th className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-left pb-3 text-sm font-medium hidden sm:table-cell`}>
                          Participants
                        </th>
                        <th className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-left pb-3 text-sm font-medium hidden md:table-cell`}>
                          Template
                        </th>
                        <th className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-left pb-3 text-sm font-medium`}>
                          Status
                        </th>
                        <th className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-right pb-3 text-sm font-medium`}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingEvents ? (
                        <tr>
                          <td colSpan={6} className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} py-4 text-center`}>
                            Loading events...
                          </td>
                        </tr>
                      ) : events.length === 0 ? (
                        <tr>
                          <td colSpan={6} className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} py-4 text-center`}>
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
                              className={`${themeConfig[isDarkMode ? 'dark' : 'light'].hover.card} transition-colors px-2 hover:bg-gray-900 rounded-2xl`}
                            >
                              <td className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} py-3 pl-1 text-sm font-medium`}>
                                {event.title}
                              </td>
                              <td className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} py-3 text-sm hidden sm:table-cell`}>
                                {new Date(event.createdAt).toLocaleDateString()}
                              </td>
                              <td className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} py-3 text-sm hidden sm:table-cell`}>
                                {totalParticipants}
                              </td>
                              <td className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} py-3 text-sm hidden md:table-cell`}>
                                {event.template?.name?.slice(0, 10) || 'No template'}
                              </td>
                              <td className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} py-3 text-sm`}>
                                <span
                                  className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.accent} px-2 py-1 rounded-full text-xs font-medium`}
                                >
                                  {status}
                                </span>
                              </td>
                              <td className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} py-3 text-right`}>
                                <div className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.accent} flex items-center justify-end gap-2`}>
                                  <Link
                                    href={`/events/${event.id}`}
                                    className={`${themeConfig[isDarkMode ? 'dark' : 'light'].hover.button} p-1.5 rounded-md`}
                                  >
                                    <FileText className="w-4 h-4" />
                                  </Link>
                                  <button
                                    className={`${themeConfig[isDarkMode ? 'dark' : 'light'].hover.button} p-1.5 rounded-md`}
                                    onClick={() => {/* Handle email action */}}
                                  >
                                    <Mail className="w-4 h-4" />
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
                className={`${themeConfig[isDarkMode ? 'dark' : 'light'].card} rounded-2xl p-5 shadow-lg border ${themeConfig[isDarkMode ? 'dark' : 'light'].border}/30 h-full`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.primary} text-lg font-semibold`}>
                    Analytics
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-xs bg-[#4b3a70]/30 px-2 py-1 rounded-md hover:bg-[#4b3a70]/40 transition-colors`}
                      title="View Weekly Analytics"
                    >
                      Week
                    </button>
                    <button
                      className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-xs hover:bg-[#4b3a70]/20 px-2 py-1 rounded-md transition-colors`}
                      title="View Monthly Analytics"
                    >
                      Month
                    </button>
                    <button
                      className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-xs hover:bg-[#4b3a70]/20 px-2 py-1 rounded-md transition-colors`}
                      title="View Yearly Analytics"
                    >
                      Year
                    </button>
                  </div>
                </div>

                {/* Event Completion Rate */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-sm font-medium flex items-center gap-1`}>
                      <BarChart3 className="w-4 h-4" /> Event Completion Rate
                    </h3>
                    <span className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-xs`}>
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
                      color={isDarkMode ? "#b7a2c9" : "#8b7ba1"}
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
                    <h3 className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-sm font-medium flex items-center gap-1`}>
                      <LineChart className="w-4 h-4" /> Email Delivery Success
                    </h3>
                    <span className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-xs`}>
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
                      color={isDarkMode ? "#7dc896" : "#8b7ba1"}
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
              className={`${themeConfig[isDarkMode ? 'dark' : 'light'].card} rounded-2xl p-5 shadow-lg border ${themeConfig[isDarkMode ? 'dark' : 'light'].border}/30`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.primary} text-lg font-semibold mb-5`}>
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/events/new"
                  className={`${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.button} p-4 rounded-xl hover:bg-[#4b3a70]/30 transition-colors flex flex-col items-center gap-2`}
                  title="Create a New Event"
                >
                  <Calendar className="w-6 h-6 text-[#b7a2c9]" />
                  <span className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-sm font-medium`}>New Event</span>
                </Link>
                <Link
                  href="/templates"
                  className={`${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.button} p-4 rounded-xl hover:bg-[#4b3a70]/30 transition-colors flex flex-col items-center gap-2`}
                  title="Manage Templates"
                >
                  <FileType className="w-6 h-6 text-[#b7a2c9]" />
                  <span className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-sm font-medium`}>Templates</span>
                </Link>
                <Link
                  href="/participants"
                  className={`${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.button} p-4 rounded-xl hover:bg-[#4b3a70]/30 transition-colors flex flex-col items-center gap-2`}
                  title="Manage Participants"
                >
                  <Users className="w-6 h-6 text-[#b7a2c9]" />
                  <span className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-sm font-medium`}>Participants</span>
                </Link>
                <Link
                  href="/settings"
                  className={`${themeConfig[isDarkMode ? 'dark' : 'light'].gradient.button} p-4 rounded-xl hover:bg-[#4b3a70]/30 transition-colors flex flex-col items-center gap-2`}
                  title="Settings"
                >
                  <Settings className="w-6 h-6 text-[#b7a2c9]" />
                  <span className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-sm font-medium`}>Settings</span>
                </Link>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className={`${themeConfig[isDarkMode ? 'dark' : 'light'].card} rounded-2xl p-5 shadow-lg border ${themeConfig[isDarkMode ? 'dark' : 'light'].border}/30`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.primary} text-lg font-semibold mb-5`}>
                Recent Activity
              </h2>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.accent} flex items-start gap-3 p-3 bg-[#4b3a70]/10 rounded-lg hover:bg-[#4b3a70]/20 transition-colors`}
                  >
                    <div className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.accent} p-2 rounded-lg`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.primary} text-sm font-medium`}>{event.title}</h3>
                        <span className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-xs`}>
                          {new Date(event.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`${themeConfig[isDarkMode ? 'dark' : 'light'].text.secondary} text-xs mt-1`}>
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
