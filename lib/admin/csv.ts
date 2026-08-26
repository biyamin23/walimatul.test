/**
 * WALIMATUL — CSV Generator & Security Sanitizer
 *
 * Implements:
 * 1. RFC 4180 CSV serialization with proper quote escaping.
 * 2. UTF-8 Byte Order Mark (BOM: \uFEFF) for seamless Malay text in Excel.
 * 3. Formula injection (DDE/CSV injection) mitigation:
 *    Prefixes dangerous leading characters (=, +, -, @, \t, \r) with a single quote (').
 */

const DANGEROUS_FORMULA_CHARS = ["=", "+", "-", "@", "\t", "\r"];

/**
 * Sanitize a single cell to prevent spreadsheet formula execution (CSV Injection).
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  let str = String(value);

  // Check if string starts with any dangerous formula characters (ignoring leading whitespace)
  const trimmed = str.trimStart();
  if (trimmed.length > 0 && DANGEROUS_FORMULA_CHARS.some((ch) => trimmed.startsWith(ch))) {
    str = `'${str}`;
  }

  // If string contains comma, double quote, newline, or carriage return, enclose in quotes & escape quotes
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Convert headers and rows into a clean, injection-safe UTF-8 BOM CSV string.
 */
export function generateCsvString(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): string {
  const BOM = "\uFEFF";

  const headerLine = headers.map((h) => sanitizeCsvCell(h)).join(",");
  const dataLines = rows.map((row) => row.map((cell) => sanitizeCsvCell(cell)).join(","));

  return BOM + [headerLine, ...dataLines].join("\r\n");
}
