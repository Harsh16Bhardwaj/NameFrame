import React from "react";
import { MdSearch, MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";
import { titanOne } from "@/lib/fonts";
interface TopBarProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  setIsMobileNavOpen: (value: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  isDarkMode,
  setIsDarkMode,
  setIsMobileNavOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleKeyPress,
}) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/5 bg-zinc-950 px-6 py-3">
      <div className="flex items-center">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="p-2 mr-4 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 transition-colors lg:hidden"
        >
          <MdMenu className="w-6 h-6" />
        </button>
        <h1 className={`hidden text-2xl font-semibold text-zinc-100 md:block ${titanOne.className}`}>Dashboard</h1>
      </div>

      <div className="flex px-6 justify-end w-full mx-auto">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full rounded-lg border border-white/10 bg-zinc-900/70 py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-500 transition-all focus:outline-none focus:border-teal-500/40 focus:ring-1 focus:ring-teal-500/20"
          />
          <MdSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4 cursor-pointer hover:text-zinc-400 transition"
            onClick={handleSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
