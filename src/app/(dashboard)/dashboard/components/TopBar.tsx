import React from "react";
import { MdSearch, MdDarkMode, MdLightMode, MdMenu } from "react-icons/md";

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
    <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-[var(--card-bg)] shadow-md border-b border-[var(--border-color)]">
      <div className="flex items-center">
        <button
          onClick={() => setIsMobileNavOpen(true)}
          className="p-2 mr-4 rounded-md text-[var(--text-secondary)] hover:bg-[var(--card-hover)] transition-colors lg:hidden"
        >
          <MdMenu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-[var(--text-primary)] hidden md:block">Dashboard</h1>
      </div>

      <div className="flex-1 px-6 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full py-2 pl-10 pr-4 text-sm bg-[var(--card-hover)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-colors"
          />
          <MdSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-5 h-5 cursor-pointer"
            onClick={handleSearch}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-[var(--card-hover)] text-[var(--text-secondary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
        >
          {isDarkMode ? <MdLightMode className="w-5 h-5" /> : <MdDarkMode className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};

export default TopBar;