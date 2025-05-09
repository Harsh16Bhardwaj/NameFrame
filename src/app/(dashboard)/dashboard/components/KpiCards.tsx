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
      icon: <IoCalendarOutline className="w-8 h-8 text-[var(--pale-text)]" />,
      trend: "+2",
    },
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      icon: <IoPeopleOutline className="w-8 h-8 text-[var(--pale-text)]" />,
      trend: "+5",
    },
    {
      title: "Certificates Generated",
      value: stats.totalCertificates,
      icon: <FaCertificate className="w-8 h-8 text-[var(--pale-text)]" />,
      trend: "+10",
    },
    {
      title: "Emails Sent",
      value: stats.totalEmailsSent,
      icon: <IoMailOutline className="w-8 h-8 text-[var(--pale-text)]" />,
      trend: "+5",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="bg-[var(--dark-onyx)] rounded-xl p-6 shadow-md border border-[var(--bluey-text)] relative overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:bg-[var(--dark-onyx-text)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <div className="flex items-start justify-between">
            <div className="bg-[var(--bluey1)] p-3 rounded-lg transition-transform duration-300 group-hover:scale-110">
              {card.icon}
            </div>
            {!loading ? (
              <div className="text-[var(--tealy-text)] text-sm font-medium flex items-center transition-opacity duration-300 hover:opacity-80">
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
            <h3 className="text-sm font-medium text-[var(--text-secondary)] transition-colors duration-300 hover:text-[var(--pale)]">{card.title}</h3>
            {!loading ? (
              <p className="text-3xl font-bold text-[var(--pale)] mt-1 transition-transform duration-300 hover:translate-x-1">{card.value}</p>
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