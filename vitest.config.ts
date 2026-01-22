import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    },
    // Debug-friendly:
// Debug-friendly:
    fileParallelism: false,
    isolate: false,

    pool: 'threads',
    poolOptions: {
        threads: {
            singleThread: true,
        },
    },})
