import React from "react";
import { motion } from "framer-motion";
import { IoCalendarOutline, IoPeopleOutline, IoMailOutline } from "react-icons/io5";
import { FaCertificate } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardsProps {
  stats: {
    totalEvents: number;
    totalParticipants: number;
    totalCertificates: number;
    totalEmailsSent: number;
  };
  loading: boolean;
  isDarkMode: boolean;
}

const KpiCards: React.FC<KpiCardsProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <IoCalendarOutline className="w-8 h-8 text-[var(--accent-color)]" />,
      trend: "+2",
    },
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      icon: <IoPeopleOutline className="w-8 h-8 text-[var(--accent-color)]" />,
      trend: "+5",
    },
    {
      title: "Certificates Generated",
      value: stats.totalCertificates,
      icon: <FaCertificate className="w-8 h-8 text-[var(--accent-color)]" />,
      trend: "+10",
    },
    {
      title: "Emails Sent",
      value: stats.totalEmailsSent,
      icon: <IoMailOutline className="w-8 h-8 text-[var(--accent-color)]" />,
      trend: "+5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="bg-[var(--card-bg)] rounded-xl p-6 shadow-md border border-[var(--border-color)] relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <div className="flex items-start justify-between">
            <div className="bg-[var(--muted)] p-3 rounded-lg">
              {card.icon}
            </div>
            {!loading ? (
              <div className="text-[var(--accent-color)] text-sm font-medium flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 1L9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1 5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {card.trend}
              </div>
            ) : (
              <Skeleton className="h-4 w-10" />
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">{card.title}</h3>
            {!loading ? (
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{card.value}</p>
            ) : (
              <Skeleton className="h-8 w-16 mt-1" />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KpiCards;