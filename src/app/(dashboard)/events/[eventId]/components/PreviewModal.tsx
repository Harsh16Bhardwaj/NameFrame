'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';

interface PreviewModalProps {
  eventId: string;
  participant: {
    id: string;
    name: string;
    email: string;
    emailed: boolean;
  };
  onClose: () => void;
}

export default function PreviewModal({ 
  eventId,
  participant, 
  onClose 
}: PreviewModalProps) {
  const certificateUrl = `/api/events/${eventId}/certificate/${participant.id}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${participant.name.replace(/\s+/g, "_")}_certificate.png`;
    link.href = `${certificateUrl}?download=1`;
    link.click();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/50 backdrop-blur-xs"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative max-w-4xl w-full rounded-2xl bg-[#322f42] border border-[#4b3a70]/50 shadow-2xl overflow-hidden"
      >
        <div className="absolute right-4 top-4">
          <button 
            onClick={onClose}
            className="rounded-full bg-[#272936]/80 p-2 text-[#c5c3c4] hover:bg-[#272936] transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6">
          <h3 className="mb-4 text-xl font-bold text-white">
            Certificate Preview for {participant.name}
          </h3>
          
          <div className="relative rounded-lg overflow-hidden border border-[#4b3a70]/30 bg-white">
            <div className="aspect-[1.414/1] w-full relative">
              <img
                src={certificateUrl}
                alt="Certificate preview"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                className="object-contain"
              />
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-[#4b3a70]/50 bg-[#272936] px-5 py-2 text-sm font-medium text-[#c5c3c4] transition-all hover:bg-[#3a3c4a]"
            >
              Close
            </button>
            
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-[#b7a2c9] px-5 py-2 text-sm font-medium text-[#212531] transition-all hover:bg-[#c9b8d7]"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
