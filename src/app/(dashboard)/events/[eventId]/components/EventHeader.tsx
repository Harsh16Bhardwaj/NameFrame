import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Edit, FileEdit } from 'lucide-react';

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
    <div className="mb-8 overflow-hidden rounded-2xl bg-[#322f42]/90 backdrop-blur-md shadow-lg border border-[#4b3a70]/30">
      <div className="relative px-6 py-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4b3a70]/10 to-transparent"></div>
        
        {/* Content */}
        <div className="relative flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white">{event.title}</h1>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-[#c5c3c4]/80">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#b7a2c9]" />
                <span>Created: {new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-[#b7a2c9]" />
                <span>{event.participants.length} Participants</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <span>ID: {event.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg border border-[#b7a2c9]/30 bg-[#4b3a70]/30 px-4 py-2 text-sm font-medium text-[#b7a2c9] transition-all hover:bg-[#4b3a70]/50"
            >
              <Edit size={16} />
              <span>Edit Event</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg border border-[#b7a2c9]/30 bg-[#4b3a70]/30 px-4 py-2 text-sm font-medium text-[#b7a2c9] transition-all hover:bg-[#4b3a70]/50"
            >
              <FileEdit size={16} />
              <span>Edit Template</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}