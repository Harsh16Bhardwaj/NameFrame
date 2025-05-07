import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { X, Download, Mail } from 'lucide-react';

interface PreviewModalProps {
  participant: {
    name: string;
    email: string;
    emailed: boolean;
  };
  templateUrl: string;
  textPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fontSettings: {
    family: string;
    size: number;
    color: string;
  };
  onClose: () => void;
}

export default function PreviewModal({ 
  participant, 
  templateUrl, 
  textPosition,
  fontSettings, 
  onClose 
}: PreviewModalProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
          
          <div className="relative rounded-lg overflow-hidden border border-[#4b3a70]/30">
            <div className="aspect-[1.414/1] w-full relative">
              {/* Certificate Image */}
              {templateUrl && (
                <Image 
                  src={templateUrl}
                  alt="Certificate preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority={false}
                />
              )}
              
              {/* Name Overlay */}
              <div 
                className="absolute flex items-center justify-center pointer-events-none"
                style={{
                  left: `${textPosition.x}%`,
                  top: `${textPosition.y}%`,
                  width: `${textPosition.width}%`,
                  height: `${textPosition.height}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <span style={{
                  fontFamily: fontSettings.family,
                  fontSize: `${fontSettings.size}px`,
                  color: fontSettings.color,
                  textAlign: 'center'
                }}>
                  {participant.name}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-lg border border-[#4b3a70]/50 bg-[#272936] px-5 py-2 text-sm font-medium text-[#c5c3c4] transition-all hover:bg-[#3a3c4a]"
            >
              Close
            </button>
            
            <button className="flex items-center gap-2 rounded-lg bg-[#b7a2c9] px-5 py-2 text-sm font-medium text-[#212531] transition-all hover:bg-[#c9b8d7]">
              <Download size={16} />
              <span>Download</span>
            </button>
            
            {!participant.emailed && (
              <button className="flex items-center gap-2 rounded-lg bg-[#4b3a70] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#5d4b82]">
                <Mail size={16} />
                <span>Send Email</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
