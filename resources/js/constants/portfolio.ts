/**
 * Portfolio-related constants
 */

/**
 * Available portfolio categories
 */
export const PORTFOLIO_CATEGORIES = [
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'IT Support',
] as const;

export type PortfolioCategory = typeof PORTFOLIO_CATEGORIES[number];

/**
 * Default placeholder image for portfolios
 */
export const DEFAULT_PORTFOLIO_IMAGE = 'https://placehold.co/600x400/0f172a/38bdf8?text=Project+Preview';

/**
 * Portfolio image storage path prefix
 */
export const PORTFOLIO_STORAGE_PATH = '/storage/';
