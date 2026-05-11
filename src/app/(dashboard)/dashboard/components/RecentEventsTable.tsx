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
      className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 h-full overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-100">Recent Events</h2>
        <Link href="/events" className="flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300 transition">
          View All <FiArrowRight size={14} />
        </Link>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loadingEvents ? (
          <div className="flex items-center justify-center py-12">
            <CgSpinner className="w-6 h-6 animate-spin text-teal-400" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="mb-4 text-sm">No events yet</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-xs font-medium transition"
            >
              <IoRefreshOutline size={14} />
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="relative w-full">
            <table className="w-full min-w-full text-sm">
              <thead>
                <tr className="text-zinc-400 font-medium border-b border-white/5">
                  <th className="text-left py-3 px-3">Event</th>
                  <th className="text-left py-3 px-3">Participants</th>
                  <th className="text-left py-3 px-3">Certificates</th>
                  <th className="text-left py-3 px-3">Emails</th>
                  <th className="text-left py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const emailed = event.participants.filter(p => p.emailed).length;
                  const allEmailed = event.participants.length > 0 && emailed === event.participants.length;
                  
                  return (
                    <tr 
                      key={event.id} 
                      onClick={() => handleRowClick(event.id)}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                    >
                      <td className="py-2.5 px-3">
                        <span className="text-zinc-100 font-medium text-xs truncate">{event.title}</span>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400 text-xs">
                        {event.participants.length}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400 text-xs">
                        {event.participants.length}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400 text-xs">
                        <span className="inline-flex gap-1">
                          <span className="bg-teal-500/10 text-teal-300 px-1.5 py-0.5 rounded text-xs font-medium">
                            {emailed}/{event.participants.length}
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          allEmailed
                            ? "bg-teal-400/10 text-teal-300 border border-teal-500/20"
                            : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        }`}>
                          {allEmailed ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentEventsTable;