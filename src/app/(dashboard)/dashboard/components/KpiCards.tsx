import React from "react";
import { motion } from "framer-motion";
import { IoCalendarOutline, IoPeopleOutline, IoMailOutline } from "react-icons/io5";
import { FaCertificate } from "react-icons/fa";
import { TrendingUp, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardsProps {
  stats: {
    totalEvents: number;
    totalParticipants: number;
    uniqueParticipants: number;
    repeatParticipants: number;
    totalCertificates: number;
    totalEmailsSent: number;
    totalEmailsPending?: number;
    totalEmailsFailed?: number;
    emailSuccessRate?: number;
    attendanceRate?: number;
  };
  loading: boolean;
  isDarkMode: boolean;
}

const KpiCards: React.FC<KpiCardsProps> = ({ stats, loading }) => {
  const cards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <IoCalendarOutline className="h-5 w-5 text-teal-300" />,
      suffix: "",
      insight: "+3 this month",
    },
    {
      title: "Unique Participants",
      value: stats.uniqueParticipants,
      icon: <IoPeopleOutline className="h-5 w-5 text-teal-300" />,
      suffix: "",
      insight: `${stats.totalParticipants} total entries`,
    },
    {
      title: "Returning Participants",
      value: stats.repeatParticipants,
      icon: <Users className="h-5 w-5 text-teal-300" />,
      suffix: "",
      insight: `${stats.repeatParticipants > 0 ? Math.round((stats.repeatParticipants / stats.uniqueParticipants) * 100) : 0}% of unique`,
    },
    {
      title: "Certificates Generated",
      value: stats.totalCertificates,
      icon: <FaCertificate className="h-5 w-5 text-teal-300" />,
      suffix: "",
      insight: "100% completion rate",
    },
    {
      title: "Emails Sent",
      value: stats.totalEmailsSent,
      icon: <IoMailOutline className="h-5 w-5 text-teal-300" />,
      suffix: "",
      insight: stats.totalEmailsPending ? `${stats.totalEmailsPending} pending` : "All delivered",
    },
    {
      title: "Email Success Rate",
      value: stats.emailSuccessRate ?? 0,
      icon: <TrendingUp className="h-5 w-5 text-teal-300" />,
      suffix: "%",
      insight: stats.totalEmailsFailed ? `${stats.totalEmailsFailed} failed` : "Excellent delivery",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-900/60 p-4 transition-all duration-300 ease-in-out hover:border-teal-500/30 hover:bg-zinc-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * index }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="rounded-lg border border-teal-500/20 bg-teal-500/10 p-2">
              {card.icon}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
              {card.title}
            </h3>
            {!loading ? (
              <p className="text-2xl font-bold text-zinc-100">
                {card.value}
                <span className="text-sm text-zinc-400">{card.suffix}</span>
              </p>
            ) : (
              <Skeleton className="h-8 w-16" />
            )}
            <p className="text-xs text-zinc-500 mt-2">{card.insight}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KpiCards;
