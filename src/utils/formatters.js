/**
 * Utility functions for formatting values
 */

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (USD, EUR, INR, etc.)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount)
}

/**
 * Format a number with compact notation for large values
 * @param {number} value - The number to format
 * @returns {string} - Formatted string (e.g., 1.2K, 3.4M)
 */
export function formatCompact(value) {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    }).format(value)
}

/**
 * Format a percentage
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places
 * @returns {string} - Formatted percentage string
 */
export function formatPercent(value, decimals = 0) {
    return `${value.toFixed(decimals)}%`
}

/**
 * Format a date string
 * @param {string} dateStr - ISO date string
 * @param {string} format - 'short', 'medium', 'long'
 * @returns {string} - Formatted date string
 */
export function formatDate(dateStr, format = 'medium') {
    if (!dateStr) return '-'

    const date = new Date(dateStr)

    const options = {
        short: { month: 'short', day: 'numeric' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    }

    return date.toLocaleDateString('en-US', options[format] || options.medium)
}

/**
 * Get relative time string (e.g., "2 days ago")
 * @param {string} dateStr - ISO date string
 * @returns {string} - Relative time string
 */
export function formatRelativeTime(dateStr) {
    if (!dateStr) return '-'

    const date = new Date(dateStr)
    const now = new Date()
    const diff = now - date

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 30) {
        return formatDate(dateStr, 'short')
    } else if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
        return 'Just now'
    }
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncate(text, maxLength = 50) {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
    if (!str) return ''
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}
