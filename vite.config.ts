import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        // NOTE: Wayfinder Vite plugin disabled — it has a bug that duplicates import lines on HMR.
        // Run `php artisan wayfinder:generate` manually after adding new routes or controllers.
    ],
    esbuild: {
        jsx: 'automatic',
    },
});

