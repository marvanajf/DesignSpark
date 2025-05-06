import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Utility function to clean content from Markdown formatting characters
 * and other special characters that might come from the AI output.
 * This is a client-side fallback for when server-side cleaning doesn't catch everything.
 */
export function cleanContent(content: string | null | undefined): string {
  if (!content) return '';
  
  return content
    // Remove markdown formatting for headers, bold, italic, etc.
    .replace(/([*#_]+)/g, '')
    // Remove hashtags at the end of content
    .replace(/(^|\s)#\w+/g, '')
    // Clean any remaining hashtags
    .replace(/#([a-zA-Z0-9_]+)/g, '$1')
    // Remove any excessive whitespace
    .replace(/\s{2,}/g, ' ')
    .trim();
}
