import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoCalendarOutline, IoPeopleOutline, IoDocumentOutline, IoMailOutline } from "react-icons/io5";

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "New Event",
      icon: <IoCalendarOutline className="w-6 h-6" />,
      href: "/dashboard/events/new",
      color: "#b7a2c9",
    },
    {
      title: "Templates",
      icon: <IoDocumentOutline className="w-6 h-6" />,
      href: "/dashboard/templates",
      color: "#b7a2c9",
    },
    {
      title: "Add Participants",
      icon: <IoPeopleOutline className="w-6 h-6" />,
      href: "/dashboard/participants/import",
      color: "#b7a2c9",
    },
    {
      title: "Send Emails",
      icon: <IoMailOutline className="w-6 h-6" />,
      href: "/dashboard/emails",
      color: "#b7a2c9",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <Link 
          key={action.title} 
          href={action.href}
          className="group"
        >
          <motion.div
            className="bg-[var(--muted)] hover:bg-[var(--card-hover)] border border-[var(--border-color)] rounded-xl p-4 transition-all duration-300 h-full flex flex-col items-center justify-center text-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div 
              className="p-3 rounded-full bg-[rgba(183,162,201,0.2)] text-[var(--accent-color)] transition-transform group-hover:scale-110"
            >
              {action.icon}
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {action.title}
            </span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;