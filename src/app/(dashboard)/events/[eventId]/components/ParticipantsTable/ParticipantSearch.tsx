import React from 'react';
import { Search } from 'lucide-react';

interface ParticipantSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export default function ParticipantSearch({ searchTerm, onSearchChange }: ParticipantSearchProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-teal-400 sm:w-96"
      />
    </div>
  );
}
