import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    site: 'https://omakasui.org',
    base: '/',
    vite: {
        plugins: [tailwindcss()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build: {
            sourcemap: false,
            rollupOptions: {
                output: {
                    sourcemap: false,
                },
            },
        },
    },

    integrations: [],
})
