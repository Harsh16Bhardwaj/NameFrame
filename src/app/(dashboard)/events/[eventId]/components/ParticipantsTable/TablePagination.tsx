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
      <div className="text-sm text-zinc-400">
        Showing {(currentPage - 1) * participantsPerPage + 1} to {Math.min(currentPage * participantsPerPage, totalParticipants)} of {totalParticipants} participants
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                  ? "border border-teal-500/30 bg-teal-500/15 text-teal-300"
                  : "border border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
        
        {totalPages > 5 && (
          <span className="flex h-8 items-center justify-center px-2 text-zinc-400">
            ...
          </span>
        )}
        
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
