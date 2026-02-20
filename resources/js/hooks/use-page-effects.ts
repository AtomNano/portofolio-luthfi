
import { useEffect } from 'react';

export function usePageEffects(title: string) {
    useEffect(() => {
        // Set dynamic document title
        const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
        document.title = title ? `${title} - ${appName}` : appName;

        // Smooth scroll to top on mount/title change
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [title]);
}
