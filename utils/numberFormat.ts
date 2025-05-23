/**
 * Formats a number to a human-readable string with K, M, B suffixes
 * @param num The number to format
 * @returns Formatted string (e.g., 1.2M, 5.4K)
 */
export function formatNumber(num: number): string {
  if (!num && num !== 0) return "N/A"
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

/**
 * Safely converts a value to a number and formats it with specified decimal places
 * @param value The value to convert and format
 * @param decimals Number of decimal places (default: 8)
 * @returns Formatted string with specified decimal places
 */
export function safeNumberFormat(value: any, decimals = 8): string {
  if (value === null || value === undefined) return "N/A"

  // Try to convert to number if it's a string
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value

  // Check if it's a valid number after conversion
  if (isNaN(numValue) || typeof numValue !== "number") return "N/A"

  return numValue.toFixed(decimals)
}
