import React from 'react';
interface FilterControlsProps {
  activeFilter: "all" | "sent" | "unsent";
  onFilterChange: (filter: "all" | "sent" | "unsent") => void;
}

export default function FilterControls({ activeFilter, onFilterChange }: FilterControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-400">Filter:</span>
      <div className="flex rounded-lg border border-zinc-700 bg-zinc-900 p-1">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeFilter === "all" ? "bg-teal-500/15 text-teal-300 border border-teal-500/30" : "text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange("sent")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeFilter === "sent" ? "bg-teal-500/15 text-teal-300 border border-teal-500/30" : "text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          Sent
        </button>
        <button
          onClick={() => onFilterChange("unsent")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            activeFilter === "unsent" ? "bg-teal-500/15 text-teal-300 border border-teal-500/30" : "text-zinc-300 hover:bg-zinc-800"
          }`}
        >
          Not Sent
        </button>
      </div>
      
    </div>
  );
}
