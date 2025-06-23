import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
//For acternity components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
