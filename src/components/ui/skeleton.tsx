import { cn } from "@/lib/utils";
import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Skeleton component for displaying loading state placeholders
 * 
 * @param {string} className - Additional Tailwind classes for styling
 * @param {...React.HTMLAttributes<HTMLDivElement>} props - HTML div attributes
 * @returns {JSX.Element} - The skeleton component with shimmer effect
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--muted)] relative overflow-hidden",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:animate-shimmer after:bg-gradient-to-r",
        "after:from-transparent after:via-[rgba(255,255,255,0.08)] after:to-transparent",
        className
      )}
      {...props}
    />
  );
}