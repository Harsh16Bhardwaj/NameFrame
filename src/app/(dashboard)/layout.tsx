"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import { themeConfig } from "@/config/theme";
import { usePathname } from "next/navigation";
import { Home, Calendar, FileType, Users } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  // Sidebar items with dynamic active state based on current path
  const sidebarItems = [
    { 
      icon: Home, 
      label: "Dashboard", 
      href: "/dashboard", 
      active: pathname === "/dashboard" 
    },
    { 
      icon: Calendar, 
      label: "Events", 
      href: "/events", 
      active: pathname === "/events" || pathname.startsWith("/events/") 
    },
    { 
      icon: FileType, 
      label: "Templates", 
      href: "/templates", 
      active: pathname === "/templates" || pathname.startsWith("/templates/") 
    },
    { 
      icon: Users, 
      label: "Participants", 
      href: "/participants", 
      active: pathname === "/participants" || pathname.startsWith("/participants/") 
    },
  ];

  // Persist sidebar state in localStorage
  useEffect(() => {
    // Resize sidebar on small screens
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Load saved preferences
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === "true");
    }
    
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true");
    }

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save preferences when changed
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));
  }, [isDarkMode]);

  return (
    <div
      className={`flex h-screen ${
        themeConfig[isDarkMode ? "dark" : "light"].background
      } ${
        themeConfig[isDarkMode ? "dark" : "light"].text.primary
      } overflow-hidden transition-all duration-500`}
    >
      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 ${
              isDarkMode ? "bg-black/50" : "bg-black/30"
            } z-30 lg:hidden backdrop-blur-sm`}
            onClick={() => setIsMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        isMobileNavOpen={isMobileNavOpen}
        setIsMobileNavOpen={setIsMobileNavOpen}
        isDarkMode={isDarkMode}
        themeConfig={themeConfig}
        //@ts-ignore
        sidebarItems={sidebarItems}
      />

      {/* Main Content - Explicitly set to fill remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Clone children and add needed props */}
        {React.cloneElement(children as React.ReactElement, {
          //@ts-ignore
          isDarkMode,
          setIsDarkMode,
          setIsMobileNavOpen,
          themeConfig
        })}
      </div>
    </div>
  );
}
