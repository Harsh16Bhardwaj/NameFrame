import React from 'react';
import { Search } from 'lucide-react';

interface ParticipantSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function ParticipantSearch({ searchTerm, onSearchChange }: ParticipantSearchProps) {
  return (
    <div className="relative ">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c5c3c4]/60" />
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full sm:w-96 bg-[#353749]  border border-[#4b3a70]/30 rounded-lg py-2 pl-10 pr-4 text-sm text-[#c5c3c4] focus:outline-none focus:ring-1 focus:ring-[#b7a2c9]/50"
      />
    </div>
  );
}