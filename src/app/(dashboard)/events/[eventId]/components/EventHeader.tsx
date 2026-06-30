import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, FileEdit } from "lucide-react";

interface EventHeaderProps {
  event: {
    id: string;
    title: string;
    organizationName?: string | null;
    organizationLogoUrl?: string | null;
    location?: string | null;
    createdAt: string;
    participants: Array<{ id: string }>;
  };
}

export default function EventHeader({ event }: EventHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
      <div className="relative px-6 py-8">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent"></div>

        <div className="relative space-y-5">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800">
                {event.organizationLogoUrl ? (
                  <img src={event.organizationLogoUrl} alt="Organization logo" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-zinc-400">LOGO</span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">{event.title}</h1>
                <p className="mt-1 text-base text-zinc-300">{event.organizationName || "Organization not set"}</p>
              </div>
            </div>

            <Link href="#certPreview">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-all hover:border-teal-500/40 hover:text-teal-300"
              >
                <FileEdit size={16} />
                <span>Edit Template</span>
              </motion.button>
            </Link>
          </div>

          <div className="flex flex-col gap-4 text-sm text-zinc-300 sm:flex-row sm:gap-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-teal-300" />
              <span className="text-gray-100">
                Created: {new Date(event.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-teal-300" />
              <span className="text-gray-100">
                {event.participants.length} Participants
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-teal-300">
                ID: <span className="text-gray-100">{event.id}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-100">
            <MapPin size={16} className="text-teal-300" />
            <span>{event.location || "Location not set"}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
