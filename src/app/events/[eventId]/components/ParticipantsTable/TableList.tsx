import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Mail, ArrowUpDown, CheckCircle, XCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

interface Participant {
  id: string;
  name: string;
  email: string;
  emailed: boolean;
  certificateUrl?: string;
}

interface SendingStatus {
  [participantId: string]: 'pending' | 'sending' | 'success' | 'error';
}

interface TableListProps {
  participants: Participant[];
  onShowPreview: (participant: Participant) => void;
  sendingStatus: SendingStatus;
  onSendCertificate: (participantId: string) => Promise<void>;
  isSending: boolean;
  eventId: string;
  itemsPerPage?: number; // Optional prop for customizing page size
}

export default function TableList({ 
  participants, 
  onShowPreview, 
  sendingStatus,
  onSendCertificate,
  isSending,
  eventId,
  itemsPerPage = 10 // Default to 10 items per page
}: TableListProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages
  const totalPages = Math.ceil(participants.length / itemsPerPage);
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentParticipants = participants.slice(indexOfFirstItem, indexOfLastItem);
  
  // Page change handlers
  const goToNextPage = () => {
    setCurrentPage(page => Math.min(page + 1, totalPages));
  };
  
  const goToPrevPage = () => {
    setCurrentPage(page => Math.max(page - 1, 1));
  };
  
  const handleDownloadCertificate = async (participant: Participant) => {
    try {
      // If certificate URL exists, download directly
      if (participant.certificateUrl) {
        window.open(participant.certificateUrl, '_blank');
        return;
      }
      
      // Otherwise generate and download
      const response = await axios.get(`/api/events/${eventId}/certificate/${participant.id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${participant.name}_certificate.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading certificate:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#4b3a70]/30">
            <th className="pb-3 pl-4 text-left text-sm font-medium text-[#c5c3c4]/70">
              <div className="flex items-center gap-1">
                <span>Name</span>
                <ArrowUpDown size={14} className="opacity-50" />
              </div>
            </th>
            <th className="pb-3 text-left text-sm font-medium text-[#c5c3c4]/70">
              <div className="flex items-center gap-1">
                <span>Email</span>
                <ArrowUpDown size={14} className="opacity-50" />
              </div>
            </th>
            <th className="pb-3 text-left text-sm font-medium text-[#c5c3c4]/70">
              <div className="flex items-center gap-1">
                <span>Status</span>
                <ArrowUpDown size={14} className="opacity-50" />
              </div>
            </th>
            <th className="pb-3 text-right text-sm font-medium text-[#c5c3c4]/70">Actions</th>
          </tr>
        </thead>
        
        <tbody>
          <AnimatePresence mode="wait">
            {currentParticipants.map((participant, index) => {
              const status = sendingStatus[participant.id];
              
              return (
                <motion.tr
                  key={participant.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`group border-b border-[#4b3a70]/20 hover:bg-[#3a3c4a]/50 transition-colors ${
                    index % 2 === 0 ? "bg-[#272936]/50" : "bg-transparent"
                  }`}
                >
                  <td className="py-3 pl-4 pr-2">
                    <div className="font-medium text-white group-hover:text-[#b7a2c9]">{participant.name}</div>
                  </td>
                  <td className="py-3 px-2 text-sm text-[#c5c3c4]/80">{participant.email}</td>
                  <td className="py-3 px-2">
                    {status === 'sending' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-900/20 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                        <Loader2 size={12} className="animate-spin" />
                        Sending...
                      </span>
                    ) : status === 'error' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-900/20 px-2.5 py-0.5 text-xs font-medium text-red-400">
                        <XCircle size={12} />
                        Failed
                      </span>
                    ) : participant.emailed || status === 'success' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-900/20 px-2.5 py-0.5 text-xs font-medium text-green-400">
                        <CheckCircle size={12} />
                        Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-900/20 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                        Not Sent
                      </span>
                    )}
                  </td>
                  <td className="py-3 pl-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onShowPreview(participant)}
                        className="p-1.5 rounded-md hover:bg-[#4b3a70]/30 text-[#c5c3c4] transition-colors"
                        title="Preview Certificate"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        onClick={() => handleDownloadCertificate(participant)}
                        className="p-1.5 rounded-md hover:bg-[#4b3a70]/30 text-[#c5c3c4] transition-colors"
                        title="Download Certificate"
                      >
                        <Download size={16} />
                      </button>
                      
                      {!participant.emailed && status !== 'sending' && (
                        <button
                          onClick={() => onSendCertificate(participant.id)}
                          disabled={isSending}
                          className={`p-1.5 rounded-md hover:bg-[#4b3a70]/30 text-[#c5c3c4] transition-colors ${
                            isSending ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
          
          {currentParticipants.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-[#c5c3c4]/60">
                No participants match your search criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="text-sm text-[#c5c3c4]/70">
            Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(indexOfLastItem, participants.length)}
            </span>{" "}
            of <span className="font-medium">{participants.length}</span> participants
          </div>
          
          <div className="flex gap-2 items-center">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md hover:bg-[#4b3a70]/30 text-[#c5c3c4] transition-colors ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="text-[#c5c3c4] font-medium px-2">
              {currentPage} / {totalPages}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md hover:bg-[#4b3a70]/30 text-[#c5c3c4] transition-colors ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}