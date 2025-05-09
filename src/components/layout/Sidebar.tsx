import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import Logo from "@/../public/nameframelogo.png";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

type SidebarProps = {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
  isMobileNavOpen: boolean;
  setIsMobileNavOpen: (value: boolean) => void;
  isDarkMode: boolean;
  themeConfig: any;
  sidebarItems: {
    icon: any;
    label: string;
    href: string;
    active: boolean;
  }[];
};

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  isMobileNavOpen,
  setIsMobileNavOpen,
  isDarkMode,
  sidebarItems,
}) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col border-r border-[var(--bluey)] bg-[var(--dark-onyx)] h-full transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "w-18" : "w-64"
        }`}
      >
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[var(--bluey)]">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src={Logo}
                alt="Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              {/* {!isSidebarCollapsed && (
                <span className="ml-3 font-medium text-xl text-[var(--text-primary)]">
                  NameFrame
                </span>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1.5 rounded-md  cursor-pointer text-[var(--text-secondary)] hover:bg-[var(--bluey-hover)] transition-colors"
              >
                {isSidebarCollapsed ? (
                  <ChevronRight size={18} />
                ) : (
                  <ChevronLeft size={18} />
                )}
              </button> */}
            </div>
          </Link>
        </div>

        <div className={`h-screen z-40 ${isSidebarCollapsed? "ml-14":"ml-60"} duration-300 absolute flex justify-end items-center`}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-2  rounded-md mt-4  bg-slate-700 cursor-pointer text-gray-200 hover:bg-[var(--bluey)] transition-colors`}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-md transition-all duration-200 group ${
                  item.active
                    ? "bg-[var(--bluey-text)] text-[var(--accent-foreground)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bluey-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                <item.icon
                  size={20}
                  className={`${isSidebarCollapsed ? "mx-auto" : "mr-3"}`}
                />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Button */}
        <div className="p-4 border-t border-[var(--bluey)]">
          <div
            className={`flex ${isSidebarCollapsed ? "justify-center" : "justify-between"} items-center`}
          >
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "w-8 h-8 rounded-full border border-[var(--border-color)] hover:border-[var(--accent-color)]",
                  userButtonPopoverCard:
                    "bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)]",
                  userButtonPopoverActionButtonText:
                    "text-[var(--text-primary)]",
                  userButtonPopoverActionButtonIcon:
                    "text-[var(--accent-color)]",
                  userButtonPopoverFooter:
                    "border-t border-[var(--border-color)]",
                },
              }}
            />
            {!isSidebarCollapsed && (
              <button className="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)] transition-colors">
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 z-40 lg:hidden bg-[var(--card-bg)] border-r border-[var(--border-color)] overflow-hidden"
          >
            {/* Mobile Logo */}
            <div className="flex items-center h-16 px-4 border-b border-[var(--border-color)]">
              <Link
                href="/dashboard"
                className="flex items-center"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Image
                  src={Logo}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-md"
                />
                <span className="ml-3 font-medium text-xl text-[var(--text-primary)]">
                  NameFrame
                </span>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 py-4 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {sidebarItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-md transition-all duration-200 ${
                      item.active
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Mobile User */}
            <div className="p-4 border-t border-[var(--border-color)]">
              <div className="flex justify-between items-center">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-8 h-8 rounded-full border border-[var(--border-color)] hover:border-[var(--accent-color)]",
                    },
                  }}
                />
                <button className="p-2 rounded-md text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)] transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
