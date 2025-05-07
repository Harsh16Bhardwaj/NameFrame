import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, User2, Plus, Send, Loader2, CheckCircle, AlertCircle, User } from 'lucide-react';
import ParticipantSearch from './ParticipantSearch';
import FilterControls from './FilterControls';
import TableList from './TableList';
import TablePagination from './TablePagination';

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

interface EmailProgress {
  sent: number;
  total: number;
}

interface ParticipantsTableProps {
  participants: Participant[];
  sendCertificates: () => Promise<void>;
  sendSingleCertificate: (participantId: string) => Promise<void>;
  isSending: boolean;
  sendingStatus: SendingStatus;
  emailProgress: EmailProgress;
  onShowPreview: (participant: Participant) => void;
}

export default function ParticipantsTable({ 
  participants, 
  sendCertificates, 
  sendSingleCertificate,
  isSending,
  sendingStatus,
  emailProgress,
  onShowPreview 
}: ParticipantsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "sent" | "unsent">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const participantsPerPage = 10;

  // Filter and search participants
  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
      // Apply search filter
      const matchesSearch =
        searchTerm === "" ||
        participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply sent/unsent filter
      const matchesFilter =
        filter === "all" ||
        (filter === "sent" && participant.emailed) ||
        (filter === "unsent" && !participant.emailed);

      return matchesSearch && matchesFilter;
    });
  }, [participants, searchTerm, filter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredParticipants.length / participantsPerPage);
  const paginatedParticipants = useMemo(() => {
    const startIndex = (currentPage - 1) * participantsPerPage;
    return filteredParticipants.slice(startIndex, startIndex + participantsPerPage);
  }, [filteredParticipants, currentPage, participantsPerPage]);

  // Count unsent participants
  const unsentCount = useMemo(() => 
    participants.filter(p => !p.emailed).length, 
    [participants]
  );

  return (
    <div className="mb-8 overflow-hidden rounded-2xl bg-[#322f42]/30 backdrop-blur-md shadow-lg border border-[#4b3a70]/30">
      <div className="p-6">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h2 className="text-4xl  flex justify-center items-center font-bold gap-x-4 text-[#ae98c0]"> <div className='border-2 border-purple-300 rounded-full p-1 text-xs'><User/></div> Participants</h2>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {isSending ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#272936] border border-[#4b3a70]/30"
              >
                <div className="flex items-center">
                  <Loader2 size={16} className="animate-spin text-[#b7a2c9]" />
                  <span className="ml-2 text-[#c5c3c4]">
                    Sending {emailProgress.sent}/{emailProgress.total} certificates...
                  </span>
                </div>
                
                <div className="w-24 h-2 bg-[#4b3a70]/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#b7a2c9]" 
                    style={{ 
                      width: `${(emailProgress.sent / emailProgress.total) * 100}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={sendCertificates}
                disabled={unsentCount === 0}
                className={`flex items-center gap-2 rounded-lg bg-[#0c8534] px-4 py-2 text-sm font-medium text-[#d8d8da] cursor-pointer transition-all hover:bg-[#35543e] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send size={16} />
                <span>Send All Certificates {unsentCount > 0 && `(${unsentCount})`}</span>
              </motion.button>
            )}
            
            {/* <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg border border-[#b7a2c9]/30 bg-[#4b3a70]/30 px-4 py-2 text-sm font-medium text-[#b7a2c9] transition-all hover:bg-[#4b3a70]/50"
            >
              <Package size={16} />
              <span>Download All (ZIP)</span>
            </motion.button> */}
            
            {/* <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 rounded-lg border border-[#b7a2c9]/30 bg-[#4b3a70]/30 px-4 py-2 text-sm font-medium text-[#b7a2c9] transition-all hover:bg-[#4b3a70]/50"
            >
              <User2 size={16} />
              <Plus size={14} className="absolute -mt-2 ml-2" />
              <span>Add Participant</span>
            </motion.button> */}
          </div>
        </div>
        <div className='border-b border-1 border-gray-700 mx-20 mb-8 '></div>
        
        {/* Search and filters */}
        <div className="mb-10 flex flex-col sm:flex-row  items-start sm:items-center justify-between">
          <ParticipantSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <FilterControls
            activeFilter={filter}
            onFilterChange={setFilter}
          />
        </div>
        
        {/* Table */}
        <TableList 
          participants={paginatedParticipants}
          onShowPreview={onShowPreview}
          sendingStatus={sendingStatus}
          onSendCertificate={sendSingleCertificate}
          isSending={isSending}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            participantsPerPage={participantsPerPage}
            totalParticipants={filteredParticipants.length}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}