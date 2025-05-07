"use client";

import React, { useState, useEffect } from "react";
import { themeConfig } from "@/config/theme";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(isDarkMode));
  }, []);

  return (
    <div
      className={`min-h-screen ${
        themeConfig[isDarkMode ? "dark" : "light"].background
      } ${themeConfig[isDarkMode ? "dark" : "light"].text.primary}`}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isDarkMode,
            setIsDarkMode,
            setIsMobileNavOpen,
            themeConfig,
          } as any);
        }
        return child;
      })}
    </div>
  );
}