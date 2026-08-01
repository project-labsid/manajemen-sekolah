import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Get current date string in WIB (Asia/Jakarta) format: YYYY-MM-DD */
export function getWIBDate(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' })
}

/** Get current time string in WIB format: HH:mm */
export function getWIBTime(): string {
  return new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
}

/** Get current ISO string in WIB timezone */
export function getWIBISOString(): string {
  const d = new Date()
  const str = d.toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta', hour12: false })
  return str.replace(' ', 'T') + '+07:00'
}
