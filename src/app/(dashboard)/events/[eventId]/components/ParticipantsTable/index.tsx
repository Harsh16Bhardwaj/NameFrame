import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, CheckCircle, User } from 'lucide-react';
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
  emailAttempts?: number;
  emailStatus?: string;
  emailError?: string;
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
  personalizedMessage?: string;
  eventId: string;
}

export default function ParticipantsTable({ 
  participants, 
  sendCertificates, 
  sendSingleCertificate,
  isSending,
  sendingStatus,
  emailProgress,
  onShowPreview,
  personalizedMessage,
  eventId
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
    <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg">
      <div className="p-6">        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col gap-2">
            <h2 className="flex items-center justify-center gap-x-4 text-3xl font-bold text-zinc-100"> 
              <div className='rounded-full border border-teal-500/40 bg-teal-500/10 p-1 text-xs text-teal-300'><User/></div> Participants
            </h2>
            {personalizedMessage?.trim() && (
              <div className="flex items-center gap-2 text-sm text-teal-300">
                <CheckCircle size={16} />
                <span>Custom email message is active</span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {isSending ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2"
              >
                <div className="flex items-center">
                  <Loader2 size={16} className="animate-spin text-teal-300" />
                  <span className="ml-2 text-zinc-300">
                    Sending {emailProgress.sent}/{emailProgress.total} certificates...
                  </span>
                </div>
                
                <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-800">
                  <div 
                    className="h-full bg-teal-300" 
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
                className={`flex cursor-pointer items-center gap-2 rounded-lg bg-teal-400 px-4 py-2 text-sm font-medium text-black transition-all hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <Send size={16} />
                <span>Send All Certificates {unsentCount > 0 && `(${unsentCount})`}</span>
              </motion.button>
            )}
          </div>
        </div>
        <div className='mx-20 mb-8 border-b border-zinc-800'></div>
        
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
          eventId={eventId}
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
