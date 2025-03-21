import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines and merges Tailwind CSS classes using clsx and tailwind-merge
 * This prevents class conflicts when using conditional classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
