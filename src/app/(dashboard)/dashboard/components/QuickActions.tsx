import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoCalendarOutline, IoPeopleOutline, IoDocumentOutline, IoMailOutline } from "react-icons/io5";

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Create Event",
      icon: <IoCalendarOutline className="w-5 h-5" />,
      href: "/create",
      description: "Start a new event",
    },
    {
      title: "Templates",
      icon: <IoDocumentOutline className="w-5 h-5" />,
      href: "/templates",
      description: "Manage templates",
    },
    {
      title: "Participants",
      icon: <IoPeopleOutline className="w-5 h-5" />,
      href: "/participants",
      description: "View all participants",
    },
    {
      title: "Send Emails",
      icon: <IoMailOutline className="w-5 h-5" />,
      href: "/events",
      description: "Email participants",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <Link 
          key={action.title} 
          href={action.href}
          className="group"
        >
          <motion.div
            className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 hover:border-teal-500/20 rounded-xl p-4 transition-all duration-300 flex flex-col items-start justify-start gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            whileHover={{ translateY: -2 }}
          >
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-300 group-hover:bg-teal-500/20 transition">
              {action.icon}
            </div>
            <div>
              <span className="text-xs font-semibold text-zinc-100 block">
                {action.title}
              </span>
              <span className="text-xs text-zinc-500">
                {action.description}
              </span>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;