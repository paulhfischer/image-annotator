import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [svelte()],
    build: {
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: 'image-annotator.js',
                assetFileNames: 'image-annotator.[ext]',
            },
        },
    },
});
