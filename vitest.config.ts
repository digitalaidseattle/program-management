import { defineConfig } from 'vitest/config';


export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        css: false, // ⬅ ignore css imports
        server: {
            deps: {
                inline: [
                    '@mui/material',
                    '@mui/system',
                    '@mui/icons-material',
                    '@mui/x-data-grid',
                    '@mui/x-date-pickers',
                ],
            },
        }
    },

});