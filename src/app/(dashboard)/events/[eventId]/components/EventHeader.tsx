import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Users, Edit, FileEdit } from "lucide-react";

interface EventHeaderProps {
  event: {
    id: string;
    title: string;
    createdAt: string;
    participants: Array<any>;
  };
}

export default function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-[#322f42]/40 backdrop-blur-md shadow-lg border border-[#4b3a70]/90">
      <div className="relative px-6 py-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4b3a70]/10 to-transparent"></div>

        {/* Content */}
        <div className="relative flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              {event.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-[#c5c3c4]/80">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#9956d4]" />
                <span className="text-gray-100">
                  Created: {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#9956d4]" />
                <span className="text-gray-100">
                  {event.participants.length} Participants
                </span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <span className="text-[#9956d4]">
                  ID: <span className="text-gray-100">{event.id}</span>{" "}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="#certPreview">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#b7a2c9]/30 bg-[#4b3a70]/30 px-4 py-1 text-sm font-medium text-[#b7a2c9] transition-all hover:bg-[#4b3a70]/50"
              >
                <FileEdit size={16} />
                <span>Edit Template</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
