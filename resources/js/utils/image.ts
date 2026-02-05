/**
 * Image utility functions
 */

/**
 * Get full storage URL for an image path
 * @param path - Image path from storage (e.g., 'portfolios/image.jpg')
 * @returns Full URL to the image
 */
export function getStorageUrl(path: string | null | undefined): string {
    if (!path) return '';
    return `/storage/${path}`;
}

/**
 * Get portfolio image URL with fallback
 * @param imagePath - Portfolio image path
 * @param fallbackUrl - Fallback URL if image path is empty
 * @returns Image URL
 */
export function getPortfolioImageUrl(
    imagePath: string | null | undefined,
    fallbackUrl: string = 'https://placehold.co/600x400/0f172a/38bdf8?text=Project+Preview'
): string {
    return imagePath ? getStorageUrl(imagePath) : fallbackUrl;
}

/**
 * Get avatar URL with UI Avatars fallback
 * @param avatarPath - User avatar path
 * @param name - User name for fallback avatar
 * @returns Avatar URL
 */
export function getAvatarUrl(
    avatarPath: string | null | undefined,
    name: string = 'User'
): string {
    if (avatarPath) {
        return getStorageUrl(avatarPath);
    }

    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=0D8ABC&color=fff&size=512`;
}

/**
 * Handle image load error by setting fallback
 * @param event - Image error event
 * @param fallbackUrl - Fallback URL
 */
export function handleImageError(
    event: React.SyntheticEvent<HTMLImageElement>,
    fallbackUrl: string
): void {
    event.currentTarget.src = fallbackUrl;
}
