import React from "react";
import { motion } from "framer-motion";
import { IoPeopleOutline, IoMailOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import { format } from "date-fns";

interface RecentActivityProps {
  events: {
    id: string;
    title: string;
    createdAt: string;
    participants: { emailed: boolean }[];
  }[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ events }) => {
  // Generate recent activities from events
  const activities = events.flatMap((event) => {
        const date = new Date(event.createdAt);
    
    // Create activity for certificate creation
    const certActivity = {
      id: `cert-${event.id}`,
      icon: <IoCheckmarkCircleOutline size={20} />,
      title: `${event.title}`,
      detail: `${event.participants.length} certificates generated`,
      timestamp: date.getTime(),
      date: date,
      color: "bg-green-900/20 text-green-400",
    };
    
    // Create activity for participant addition
    const participantActivity = {
      id: `part-${event.id}`,
      icon: <IoPeopleOutline size={20} />,
      title: `${event.title}`,
      detail: `${event.participants.length} participants added`,
      timestamp: date.getTime() - 1000, // 1 second before for sorting
      date: date, // Same display date as event
      color: "bg-blue-900/20 text-blue-400",
    };
    
    // Create activity for email if any were sent
    const emailsSent = event.participants.filter(p => p.emailed).length;
    const emailActivity = emailsSent > 0 ? {
      id: `email-${event.id}`,
      icon: <IoMailOutline size={20} />,
      title: `${event.title}`,
      detail: `${emailsSent} emails sent`,
      timestamp: date.getTime() - 2000, // 2 seconds before for sorting
      date: date, // Same display date as event
      color: "bg-purple-900/20 text-purple-400",
    } : null;
    
    return [certActivity, participantActivity, emailActivity].filter(Boolean);
  });
  
  // Sort activities by timestamp (most recent first)
  const sortedActivities = activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);
  
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 0) {
      return "just now";
    }
    
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return `yesterday`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return format(date, "MMM d, yyyy");
  };

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {sortedActivities.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          <p className="text-sm">No recent activity yet</p>
        </div>
      ) : (
        sortedActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="flex gap-3 p-3 border border-white/5 rounded-lg bg-black/20 hover:bg-black/30 transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <div className={`p-2 rounded-lg flex-shrink-0 ${
              activity.color.includes('green') ? 'bg-teal-500/10 text-teal-400' :
              activity.color.includes('blue') ? 'bg-cyan-500/10 text-cyan-400' :
              'bg-amber-500/10 text-amber-400'
            }`}>
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-zinc-100 text-xs truncate">
                  {activity.title}
                </p>
                <span className="text-xs text-zinc-500 whitespace-nowrap flex-shrink-0">
                  {getRelativeTime(activity.date)}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activity.detail}
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
};

export default RecentActivity;