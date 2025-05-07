import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  participantsPerPage: number;
  totalParticipants: number;
  onPageChange: (page: number) => void;
}

export default function TablePagination({ 
  currentPage, 
  totalPages, 
  participantsPerPage,
  totalParticipants, 
  onPageChange 
}: TablePaginationProps) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-[#c5c3c4]/60">
        Showing {(currentPage - 1) * participantsPerPage + 1} to {Math.min(currentPage * participantsPerPage, totalParticipants)} of {totalParticipants} participants
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#4b3a70]/30 bg-[#272936] transition-colors hover:bg-[#4b3a70]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
          const pageNumber = i + 1;
          const isActive = pageNumber === currentPage;
          
          return (
            <button
              key={i}
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                isActive
                  ? "bg-[#b7a2c9] text-[#212531]"
                  : "border border-[#4b3a70]/30 bg-[#272936] hover:bg-[#4b3a70]/30"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        
        {totalPages > 5 && (
          <span className="flex h-8 items-center justify-center px-2 text-[#c5c3c4]/60">
            ...
          </span>
        )}
        
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#4b3a70]/30 bg-[#272936] transition-colors hover:bg-[#4b3a70]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}