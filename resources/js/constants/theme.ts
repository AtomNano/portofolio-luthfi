/**
 * Theme-related constants
 */

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION = {
    /** Default transition duration */
    DURATION: 600,
    /** Carousel auto-rotate interval */
    CAROUSEL_INTERVAL: 4000,
    /** Scroll threshold for showing scroll-to-top button */
    SCROLL_THRESHOLD: 400,
} as const;

/**
 * Color palette (Tailwind classes)
 */
export const COLORS = {
    primary: 'cyan-400',
    primaryHover: 'cyan-500',
    background: {
        dark: 'gray-950',
        medium: 'gray-900',
        light: 'gray-800',
    },
    border: {
        dark: 'gray-800',
        light: 'gray-700',
    },
    text: {
        primary: 'white',
        secondary: 'gray-400',
        muted: 'gray-500',
    },
} as const;

/**
 * Breakpoints (matches Tailwind defaults)
 */
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;
