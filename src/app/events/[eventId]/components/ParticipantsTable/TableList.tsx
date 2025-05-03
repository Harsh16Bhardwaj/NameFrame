import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Mail, ArrowUpDown, CheckCircle, XCircle, Loader2 } from 'lucide-react';

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
}

export default function TableList({ 
  participants, 
  onShowPreview, 
  sendingStatus,
  onSendCertificate,
  isSending
}: TableListProps) {
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
            {participants.map((participant, index) => {
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
          
          {participants.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-[#c5c3c4]/60">
                No participants match your search criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}