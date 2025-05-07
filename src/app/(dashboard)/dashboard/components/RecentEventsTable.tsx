import React from "react";
import { motion } from "framer-motion";
import { CgSpinner } from "react-icons/cg";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { IoRefreshOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

interface RecentEventsTableProps {
  events: {
    id: string;
    title: string;
    createdAt: string;
    participants: { emailed: boolean }[];
    template: { name: string };
  }[];
  loadingEvents: boolean;
  isDarkMode: boolean;
  fetchEvents: () => void;
}

const RecentEventsTable: React.FC<RecentEventsTableProps> = ({ 
  events, 
  loadingEvents, 
  fetchEvents 
}) => {
  const router = useRouter();
  
  const getStatusInfo = (event: any) => {
    const allEmailed = event.participants.length > 0 && 
      event.participants.every((p: { emailed: boolean }) => p.emailed);
    
    return allEmailed 
      ? { label: "Completed", className: "text-green-400 bg-green-900/30" }
      : { label: "Scheduled", className: "text-blue-400 bg-blue-900/30" };
  };
  
  const handleRowClick = (eventId: string) => {
    console.log(`Navigating to event with ID: ${eventId}`);
    router.push(`/events/${eventId}`);
  };

  return (
    <motion.div
      className="bg-[var(--card-bg)] rounded-2xl p-5 shadow-md border border-[var(--border-color)] h-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Events</h2>
        <Link href="/events" className="flex items-center gap-1 text-sm font-medium text-[var(--accent-color)] hover:underline">
          View All <FiArrowRight size={14} />
        </Link>
      </div>

      <div className="h-[calc(100%-3rem)]">
        {loadingEvents ? (
          <div className="flex items-center justify-center py-12">
            <CgSpinner className="w-8 h-8 animate-spin text-[var(--accent-color)]" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            <p className="mb-4">No events found</p>
            <button 
              onClick={fetchEvents}
              className="flex items-center gap-1.5 mx-auto text-[var(--accent-color)] hover:underline"
            >
              <IoRefreshOutline size={16} />
              Refresh data
            </button>
          </div>
        ) : (
          <div className="relative w-full">
            <table className="w-full min-w-full">
              <thead>
                <tr className="text-[var(--text-secondary)] text-sm font-medium border-b border-[var(--border-color)]">
                  <th className="text-left py-4 px-2">Event Name</th>
                  <th className="text-left py-4 px-2">Date</th>
                  <th className="text-left py-4 px-2">Participants</th>
                  <th className="text-left py-4 px-2">Template</th>
                  <th className="text-left py-4 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr 
                    key={event.id} 
                    onClick={() => handleRowClick(event.id)}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-2">
                      <span className="text-[var(--text-primary)] font-medium">{event.title}</span>
                    </td>
                    <td className="py-4 px-2 text-[var(--text-secondary)]">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-2 text-[var(--text-primary)]">
                      {event.participants.length}
                    </td>
                    <td className="py-4 px-2 text-[var(--text-secondary)]">
                      {event.template.name}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(event).className}`}>
                        {getStatusInfo(event).label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentEventsTable;