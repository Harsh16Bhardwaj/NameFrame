import React from 'react';
import { Filter } from 'lucide-react';

interface FilterControlsProps {
  activeFilter: "all" | "sent" | "unsent";
  onFilterChange: (filter: "all" | "sent" | "unsent") => void;
}

export default function FilterControls({ activeFilter, onFilterChange }: FilterControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#c5c3c4]/60">Filter:</span>
      <div className="flex rounded-lg bg-[#272936] p-1">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeFilter === "all" ? "bg-[#4b3a70] text-white" : "text-[#c5c3c4]/80 hover:bg-[#4b3a70]/30"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange("sent")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeFilter === "sent" ? "bg-[#4b3a70] text-white" : "text-[#c5c3c4]/80 hover:bg-[#4b3a70]/30"
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => onFilterChange("unsent")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeFilter === "unsent" ? "bg-[#4b3a70] text-white" : "text-[#c5c3c4]/80 hover:bg-[#4b3a70]/30"
          }`}
        >
          Not Sent
        </button>
      </div>
      
    </div>
  );
}