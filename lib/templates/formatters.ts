/**
 * WALIMATUL — Deterministic Date & Time Formatters for Invitations
 *
 * Avoids hydration mismatches by formatting dates and times with fixed deterministic logic
 * rather than relying on browser locale defaults.
 */

const MONTH_NAMES_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface ParsedDate {
  dayOfWeek: string;
  dayNumber: string;
  monthName: string;
  monthNumber: string;
  year: string;
  fullDateFormatted: string; // e.g. "Tuesday, 24 November 2026"
}

/**
 * Parse an ISO date string (YYYY-MM-DD or full ISO string) into deterministic components.
 * Returns null if the input is invalid or null.
 */
export function parseInvitationDate(dateStr: string | null | undefined): ParsedDate | null {
  if (!dateStr) return null;

  // Extract YYYY-MM-DD cleanly even from full ISO timestamp
  const dateOnlyMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!dateOnlyMatch) return null;

  const year = dateOnlyMatch[1];
  const monthIdx = parseInt(dateOnlyMatch[2], 10) - 1;
  const dayNum = parseInt(dateOnlyMatch[3], 10);

  if (monthIdx < 0 || monthIdx > 11 || dayNum < 1 || dayNum > 31) return null;

  // Use UTC date constructor to prevent local timezone shift
  const dateObj = new Date(Date.UTC(parseInt(year, 10), monthIdx, dayNum));
  const dayOfWeek = DAY_NAMES_EN[dateObj.getUTCDay()];
  const monthName = MONTH_NAMES_EN[monthIdx];
  const dayNumber = String(dayNum);
  const monthNumber = String(monthIdx + 1).padStart(2, "0");

  return {
    dayOfWeek,
    dayNumber,
    monthName,
    monthNumber,
    year,
    fullDateFormatted: `${dayOfWeek}, ${dayNumber} ${monthName} ${year}`,
  };
}

/**
 * Format a date string into "24 November 2026".
 * Safe fallback for null/invalid inputs.
 */
export function formatWeddingDate(dateStr: string | null | undefined): string {
  const parsed = parseInvitationDate(dateStr);
  if (!parsed) return dateStr || "";
  return `${parsed.dayNumber} ${parsed.monthName} ${parsed.year}`;
}

/**
 * Format a database time string (e.g. "11:00:00", "11:00", "16:30:00") into "11:00 AM" or "4:30 PM".
 */
export function formatWeddingTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "";

  const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!match) return timeStr;

  let hour = parseInt(match[1], 10);
  const minute = match[2];

  if (isNaN(hour)) return timeStr;

  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute} ${ampm}`;
}

/**
 * Format a time range (e.g. start: "11:00:00", end: "16:00:00" -> "11:00 AM — 4:00 PM").
 */
export function formatTimeRange(
  startTime: string | null | undefined,
  endTime: string | null | undefined
): string {
  const start = formatWeddingTime(startTime);
  const end = formatWeddingTime(endTime);

  if (start && end) return `${start} — ${end}`;
  if (start) return `From ${start}`;
  if (end) return `Until ${end}`;
  return "";
}
