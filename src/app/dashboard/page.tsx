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

export default function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [namePosition, setNamePosition] = useState({ x: 50, y: 60 }); // % values
  const [zoom, setZoom] = useState(1);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
    { icon: Award, label: "Certificates", href: "/certificates" },
    { icon: Settings, label: "Settings", href: "/settings" },
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
        className={`bg-[#322f42] fixed lg:relative z-40 h-full shadow-xl flex flex-col`}
        initial={false}
        animate={{
          width: isSidebarCollapsed ? "80px" : "240px",
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-[#322f42]/90 backdrop-blur-sm border-b border-[#4b3a70]/30 flex items-center justify-between px-4 gap-4">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-lg lg:hidden"
              onClick={() => setIsMobileNavOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-white hidden sm:block">
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
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full hover:bg-[#4b3a70]/20"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-[#4b3a70]/20">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            <div className="h-8 w-px bg-[#4b3a70]/30"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#4b3a70] flex items-center justify-center">
                <span className="text-xs font-medium text-white">AM</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Alex Morgan</p>
                <p className="text-xs text-[#c5c3c4]/70">Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 hidden md:block" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {dashboardData.kpis.map((kpi, index) => (
              <motion.div
                key={index}
                className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-[#4b3a70]/20">
                    <kpi.icon className="w-5 h-5 text-[#b7a2c9]" />
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <ArrowUpRight
                      className={`w-3 h-3 ${
                        kpi.change > 0
                          ? "text-green-500"
                          : "text-red-500 rotate-90"
                      }`}
                    />
                    <span
                      className={`${
                        kpi.change > 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {kpi.change > 0 ? "+" : ""}
                      {kpi.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-[#c5c3c4]/70 text-sm font-medium mb-1">
                  {kpi.title}
                </h3>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-white">
                    {kpi.value.toLocaleString()}
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
            ))}
          </div>

          {/* Second Row - Tables and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events Table */}
            <div className="lg:col-span-2">
              <motion.div
                className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-semibold text-white">
                    Recent Events
                  </h2>
                  <Link
                    href="/events"
                    className="text-sm font-medium flex items-center gap-1 text-[#b7a2c9] hover:text-[#c9b8d7] transition-colors"
                  >
                    View All <ChevronRight className="w-4 h-4" />
                  </Link>
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
                      {dashboardData.events.map((event, index) => (
                        <tr
                          key={index}
                          className={`hover:bg-[#3a3c4a] transition-colors ${
                            index % 2 === 0 ? "bg-[#2d2f3d]" : "bg-[#272936]"
                          }`}
                        >
                          <td className="py-3 pl-1 text-sm font-medium">
                            {event.name}
                          </td>
                          <td className="py-3 text-sm hidden sm:table-cell">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 text-sm hidden sm:table-cell">
                            {event.participants}
                          </td>
                          <td className="py-3 text-sm hidden md:table-cell">
                            {event.template}
                          </td>
                          <td className="py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                event.status === "Completed"
                                  ? "bg-green-900/20 text-green-400"
                                  : event.status === "In Progress"
                                  ? "bg-blue-900/20 text-blue-400"
                                  : "bg-orange-900/20 text-orange-400"
                              }`}
                            >
                              {event.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1.5 rounded-md hover:bg-[#4b3a70]/20 text-[#c5c3c4]">
                                <FileText className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 rounded-md hover:bg-[#4b3a70]/20 text-[#c5c3c4]">
                                <Mail className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 rounded-md hover:bg-[#4b3a70]/20 text-[#c5c3c4]">
                                <Sliders className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>

            {/* Charts */}
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
                    <button className="text-xs bg-[#4b3a70]/30 text-[#c5c3c4] px-2 py-1 rounded-md">
                      Week
                    </button>
                    <button className="text-xs hover:bg-[#4b3a70]/20 text-[#c5c3c4]/70 px-2 py-1 rounded-md">
                      Month
                    </button>
                    <button className="text-xs hover:bg-[#4b3a70]/20 text-[#c5c3c4]/70 px-2 py-1 rounded-md">
                      Year
                    </button>
                  </div>
                </div>

                {/* Weekly Upload Chart */}
                <div className="mb-6 space-y-2">
                  <h3 className="text-sm font-medium text-[#c5c3c4]/70 flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" /> Weekly Uploads
                  </h3>
                  <div className="px-3">
                    <BarChart
                      data={dashboardData.weeklyUploads}
                      color="#b7a2c9"
                      height={120}
                      width={300}
                    />
                    <div className="flex justify-between mt-1 text-xs text-[#c5c3c4]/70">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>

                {/* Email Delivery Chart */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-[#c5c3c4]/70 flex items-center gap-1">
                    <LineChart className="w-4 h-4" /> Email Delivery Success
                  </h3>
                  <div className="px-3">
                    <LineChart2
                      data={dashboardData.emailDelivery.success}
                      color="#7dc896"
                      height={120}
                      width={300}
                    />
                    <div className="flex justify-between mt-1 text-xs text-[#c5c3c4]/70">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Third Row - Template Preview */}
          <motion.div
            className="bg-[#322f42] rounded-2xl p-5 shadow-lg border border-[#4b3a70]/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-white">
                Certificate Preview
              </h2>
              <div className="flex items-center gap-2">
                <button
                  className="text-xs bg-[#4b3a70]/30 px-2 py-1 rounded-md text-[#c5c3c4]"
                  onClick={() => setZoom(1)}
                >
                  Reset View
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Template Selector */}
              <div className="p-3 bg-[#272936] rounded-xl space-y-3">
                <h3 className="text-sm font-medium text-[#c5c3c4]/70">
                  Choose Template
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-2">
                  {dashboardData.certificateTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full p-2 rounded-lg text-left flex items-center gap-2 text-sm ${
                        selectedTemplate === template.id
                          ? "bg-[#4b3a70]/40 text-[#b7a2c9]"
                          : "hover:bg-[#4b3a70]/20"
                      }`}
                    >
                      <div className="w-8 h-8 rounded bg-[#212531]/50 flex-shrink-0"></div>
                      <span className="truncate">{template.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#4b3a70]/30 space-y-3">
                  <h3 className="text-sm font-medium text-[#c5c3c4]/70">
                    Text Position
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#c5c3c4]/70 mb-1 block">
                        Horizontal (%)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={namePosition.x}
                        onChange={(e) =>
                          setNamePosition({
                            ...namePosition,
                            x: Number(e.target.value),
                          })
                        }
                        className="w-full accent-[#b7a2c9]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-[#c5c3c4]/70 mb-1 block">
                        Vertical (%)
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={namePosition.y}
                        onChange={(e) =>
                          setNamePosition({
                            ...namePosition,
                            y: Number(e.target.value),
                          })
                        }
                        className="w-full accent-[#b7a2c9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#c5c3c4]/70 mb-1 block">
                      Zoom
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full accent-[#b7a2c9]"
                    />
                  </div>
                </div>
              </div>

              {/* Certificate Preview */}
              <div className="lg:col-span-3 relative rounded-xl overflow-hidden bg-[#272936]">
                <div
                  className="w-full h-64 flex items-center justify-center overflow-hidden"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "center center",
                  }}
                >
                  {/* This would be replaced by the actual certificate template */}
                  <div className="relative w-full h-full px-8 py-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#322f42] to-[#272936] opacity-50"></div>
                    <div className="relative h-full border-8 border-[#4b3a70]/30 flex items-center justify-center">
                      <div
                        className="absolute text-white text-xl font-serif"
                        style={{
                          left: `${namePosition.x}%`,
                          top: `${namePosition.y}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        John Doe
                      </div>
                      {/* Certificate Design Elements - Simplified for the mockup */}
                      <div className="absolute top-8 left-0 right-0 text-center">
                        <h3 className="text-[#b7a2c9] text-xs tracking-widest">
                          CERTIFICATE OF COMPLETION
                        </h3>
                      </div>
                      <div className="absolute bottom-8 left-0 right-0 flex justify-between px-12 text-xs text-[#c5c3c4]/70">
                        <span>Date: May 1, 2024</span>
                        <span>CEO: Jane Smith</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#212531] to-transparent">
                  <div className="flex items-center justify-between">
                    <button className="text-xs bg-[#b7a2c9] hover:bg-[#c9b8d7] text-[#212531] font-medium px-3 py-1.5 rounded-md transition-all transform hover:scale-105 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Send Certificates
                    </button>
                    <div className="text-xs text-[#c5c3c4]/70">
                      Position: {namePosition.x}% × {namePosition.y}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
