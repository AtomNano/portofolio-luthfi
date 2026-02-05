/**
 * Formatting utility functions
 */

/**
 * Truncate text to specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format date to locale string
 * @param date - Date to format
 * @param locale - Locale (default: 'id-ID')
 * @returns Formatted date string
 */
export function formatDate(
    date: string | Date,
    locale: string = 'id-ID'
): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format number with thousand separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
    return num.toLocaleString('id-ID');
}

/**
 * Calculate percentage
 * @param value - Current value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
}

/**
 * Parse comma-separated string to array
 * @param str - Comma-separated string
 * @returns Array of trimmed strings
 */
export function parseCommaSeparated(str: string): string[] {
    return str
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');
}

/**
 * Join array to comma-separated string
 * @param arr - Array of strings
 * @returns Comma-separated string
 */
export function joinWithComma(arr: string[]): string {
    return arr.join(', ');
}
