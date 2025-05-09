"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  Award,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  FileText,
  Send,
  Users,
  Copy,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Participant {
  id: string;
  name: string;
  email: string;
  emailStatus: string;
  createdAt: string;
  event: {
    title: string;
    createdAt: string;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Filters {
  emailStatus: string;
  dateRange: string;
  eventFilter: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    emailStatus: "all",
    dateRange: "all",
    eventFilter: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  });
  const [events, setEvents] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const fetchParticipants = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        search: searchQuery,
        page: page.toString(),
        limit: pagination.limit.toString(),
        emailStatus: filters.emailStatus,
        dateRange: filters.dateRange,
        eventFilter: filters.eventFilter,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/participants?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setParticipants(data.data.participants);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching participants:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      if (data.success) {
        setEvents(data.data.map((event: any) => event.title));
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchParticipants();
    fetchEvents();
  }, [searchQuery, filters]);

  const handleExport = async () => {
    try {
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
    } catch (error) {
      console.error("Error exporting participants:", error);
    }
  };

  const handleSearch = () => {
    fetchParticipants(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const copyEmailToClipboard = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      setNotificationMessage("Email copied to clipboard!");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SENT":
        return "bg-gradient-to-r from-[var(--tealy)]/20 to-[var(--bluey)]/20 text-[var(--tealy-text)] border border-[var(--tealy)]/30";
      case "PENDING":
        return "bg-gradient-to-r from-[var(--yellow)]/20 to-[var(--yellow)]/20 text-[var(--yellow-text)] border border-[var(--yellow)]/30";
      case "FAILED":
        return "bg-gradient-to-r from-[var(--love)]/20 to-[var(--love)]/20 text-[var(--love-text)] border border-[var(--love)]/30";
      default:
        return "bg-gradient-to-r from-[var(--space)]/20 to-[var(--space)]/20 text-[var(--space-text)] border border-[var(--space)]/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SENT":
        return <Check className="w-3 h-3" />;
      case "PENDING":
        return <AlertCircle className="w-3 h-3" />;
      case "FAILED":
        return <X className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[var(--dark-onyx)] text-[var(--pale-text)] p-8 relative  pt-24"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 ">
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
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[var(--bluey)]/10 to-transparent rounded-full blur-3xl"
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
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tr from-[var(--tealy)]/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Notification Popup */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-4 right-4 bg-[var(--onyx)] backdrop-blur-sm text-[var(--pale)] px-6 py-3 rounded-lg shadow-lg border border-[var(--space)]/30 flex items-center gap-2 z-50"
          >
            <Check className="w-5 h-5 text-[var(--tealy)]" />
            <span>{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--tealy-heading)] via-[var(--pale)] to-[var(--bluey)] text-transparent bg-clip-text">
              Participants
            </h1>
            <p className="text-[var(--tealy-text)] mt-2">
              Manage and track all your event participants
            </p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              className="px-4 py-2 cursor-pointer bg-gradient-to-r from-[var(--tealy)] to-[var(--bluey)] hover:from-[var(--bluey1)] hover:to-[var(--bluey-hover)] text-[var(--pale-text)] font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-[var(--tealy)]/20"
            >
              <Download className="w-4 h-4" />
              Export List
            </motion.button>
          </div>
        </motion.div>

        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-[var(--bluey-hover)] backdrop-blur-sm rounded-lg p-6 mb-6 border border-[var(--tealy)]/60 duration-100 ease-in-out shadow-lg"
            >
              <button
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                className="flex justify-between w-full cursor-pointer hover:bg-[var(--dark-onyx)] transition-colors rounded-lg p-1 items-center mb-4"
              >
                <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-200" />
                  Filters
                </h3>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[var(--space-text)] hover:text-[var(--tealy)] transition-colors"
                >
                  {isFilterExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </motion.div>
              </button>

              <AnimatePresence>
                {isFilterExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {/* Email Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm border-b border-[var(--space)]/30 text-[var(--space-text)] flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Status
                      </label>
                      <select
                        value={filters.emailStatus}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            emailStatus: e.target.value,
                          })
                        }
                        className="w-full bg-[var(--bluey1)]/30 border border-[var(--space)] rounded-lg px-2 py-2 focus:outline-none focus:border-[var(--tealy)] text-gray-300"
                      >
                        <option value="all">All Statuses</option>
                        <option value="SENT">Sent</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                      </select>
                    </div>

                    {/* Date Range Filter */}
                    <div className="space-y-2">
                      <label className="text-sm text-[var(--space-text)] flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        Date Range
                      </label>
                      <select
                        value={filters.dateRange}
                        onChange={(e) =>
                          setFilters({ ...filters, dateRange: e.target.value })
                        }
                        className="w-full bg-[var(--bluey1)]/30 border border-[var(--space)] rounded-lg px-2 py-2 focus:outline-none focus:border-[var(--tealy)] text-gray-300"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="last7">Last 7 Days</option>
                        <option value="last30">Last 30 Days</option>
                        <option value="last90">Last 90 Days</option>
                        <option value="thisMonth">This Month</option>
                        <option value="lastMonth">Last Month</option>
                      </select>
                    </div>

                    {/* Event Filter */}
                    <div className="space-y-2">
                      <label className="text-sm text-[var(--space-text)] flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Event
                      </label>
                      <select
                        value={filters.eventFilter}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            eventFilter: e.target.value,
                          })
                        }
                        className="w-full bg-[var(--bluey1)]/30 border border-[var(--space)] rounded-lg px-2 py-2 focus:outline-none focus:border-[var(--tealy)] text-gray-300"
                      >
                        <option value="all">All Events</option>
                        {events.map((event) => (
                          <option key={event} value={event}>
                            {event}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-2">
                      <label className="text-sm text-[var(--space-text)] flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Sort By
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={filters.sortBy}
                          onChange={(e) =>
                            setFilters({ ...filters, sortBy: e.target.value })
                          }
                          className="flex-1 bg-[var(--bluey1)]/30 border border-[var(--space)] rounded-lg px-2 py-2 focus:outline-none focus:border-[var(--tealy)] text-gray-300"
                        >
                          <option value="createdAt">Date Created</option>
                          <option value="name">Name</option>
                          <option value="email">Email</option>
                          <option value="event">Event</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick Filter Actions */}
              <div className="flex gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setFilters({
                      emailStatus: "all",
                      dateRange: "all",
                      eventFilter: "all",
                      sortBy: "createdAt",
                      sortOrder: "desc",
                    })
                  }
                  className="px-4 py-2 cursor-pointer bg-[var(--space)]/60 hover:bg-[var(--space)]/70 text-[var(--tealy-heading)] font-medium rounded-lg transition-colors flex items-center gap-2 border border-[var(--space)]"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset Filters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchParticipants(1)}
                  className="px-4 py-2 duration-200 ease-in-out hover:duration-200 hover:ease-in-out cursor-pointer bg-gradient-to-r from-[var(--bluey-text)] to-[var(--bluey)] hover:from-[var(--bluey-hover)] hover:to-[var(--bluey1)] text-gray-200 font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-[var(--tealy)]/20"
                >
                  <Search className="w-4 h-4" />
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[var(--onyx)] backdrop-blur-sm rounded-lg p-6 mb-8 border border-[var(--space)]/30 shadow-xl"
        >
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--space-text)] w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-4 pr-4 py-3 bg-[var(--dark-onyx)]/50 backdrop-blur-sm rounded-lg focus:outline-none focus:border-[var(--tealy)] transition-all border border-[var(--bluey)] text-[var(--pale)]"
              />
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 cursor-pointer bg-[var(--space)]/30 hover:bg-[var(--space)]/40 text-gray-300 font-medium rounded-lg transition-all flex items-center gap-2 border border-[var(--space)] backdrop-blur-sm"
              >
                <Filter className="w-4 h-4 text-gray-300" />
                Filters
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="px-6 py-3 cursor-pointer bg-gradient-to-r from-[var(--tealy)] to-[var(--bluey)] hover:from-[var(--bluey1)] hover:to-[var(--bluey-hover)] text-[var(--pale-text)] font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-[var(--tealy)]/20"
              >
                <Search className="w-4 h-4" />
                Search
              </motion.button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--dark-onyx)]/80 backdrop-blur-xl rounded-lg p-4 border border-[var(--bluey1)] shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bluey)]">
                  <Users className="w-5 h-5 text-[var(--pale)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--space-text)]">
                    Total Participants
                  </p>
                  <p className="text-3xl font-bold text-[var(--pale)]">
                    {pagination.total}
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--dark-onyx)]/80 backdrop-blur-xl rounded-lg p-4 border border-[var(--bluey1)] shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bluey)]">
                  <Mail className="w-5 h-5 text-[var(--pale)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--space-text)]">Emails Sent</p>
                  <p className="text-3xl font-bold text-[var(--pale)]">
                    {
                      participants.filter((p) => p.emailStatus === "SENT").length
                        
                    }
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-[var(--dark-onyx)]/80 backdrop-blur-xl rounded-lg p-4 border border-[var(--bluey1)] shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--bluey)]">
                  <AlertCircle className="w-5 h-5 text-[var(--pale)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--space-text)]">Pending Actions</p>
                  <p className="text-3xl font-bold text-[var(--pale)]">
                    {
                      participants.filter((p) => p.emailStatus === "PENDING")
                        .length
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-8 h-8 text-[var(--tealy)]" />
              </motion.div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-[var(--bluey)]/20 backdrop-blur-xl rounded-2xl p-4 border border-[var(--space)]/30 shadow-lg">
                      <th className="text-left py-4 px-4 text-[var(--space-text)] font-medium">
                        Name
                      </th>
                      <th className="text-left py-4 px-4 text-[var(--space-text)] font-medium">
                        Email
                      </th>
                      <th className="text-left py-4 px-4 text-[var(--space-text)] font-medium">
                        Event
                      </th>
                      <th className="text-left py-4 px-4 text-[var(--space-text)] font-medium">
                        Status
                      </th>
                      <th className="text-left py-4 px-4 text-[var(--space-text)] font-medium">
                        Created
                      </th>
                      <th className="text-right py-4 px-4 text-[var(--space-text)] font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((participant) => (
                      <motion.tr
                        key={participant.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-b border-[var(--space)]/30 hover:bg-[var(--bluey-hover)] transition-colors group"
                      >
                        <td className="py-4 px-4 text-[var(--pale)]">{participant.name}</td>
                        <td className="py-4 px-4 text-[var(--space-text)]">
                          {participant.email}
                        </td>
                        <td className="py-4 px-4">
                          <Link
                            href={`/events/${participant.event.title}`}
                            className="text-[var(--tealy)] hover:text-[var(--tealy-heading)] transition-colors"
                          >
                            {participant.event.title}
                          </Link>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 w-fit ${getStatusColor(
                              participant.emailStatus
                            )}`}
                          >
                            {getStatusIcon(participant.emailStatus)}
                            {participant.emailStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-[var(--space-text)]">
                          {new Date(participant.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center text-gray-200 justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                copyEmailToClipboard(participant.email)
                              }
                              className="p-2 rounded-lg bg-[var(--space)]/20 hover:bg-[var(--space)]/30 transition-all"
                              title="Copy Email"
                            >
                              <Copy className="w-4 h-4 text-[var(--tealy)]" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {participants.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-[var(--space-text)] mx-auto mb-4" />
                  <p className="text-[var(--space-text)] text-lg">
                    No participants found
                  </p>
                  <p className="text-[var(--space-text)]/80 text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-[var(--space-text)]">
                  Showing {participants.length} of {pagination.total}{" "}
                  participants
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fetchParticipants(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="p-2 rounded-lg bg-[var(--space)]/20 hover:bg-[var(--space)]/30 transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="w-5 h-5 text-[var(--tealy)]" />
                    </motion.button>
                    <span className="px-4 py-2 rounded-lg bg-[var(--space)]/20 text-[var(--pale-text)]">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fetchParticipants(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="p-2 rounded-lg bg-[var(--space)]/20 hover:bg-[var(--space)]/30 transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="w-5 h-5 text-[var(--tealy)]" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}