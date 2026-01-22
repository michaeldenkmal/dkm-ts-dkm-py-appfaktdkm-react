import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
    test: {
        include: ['./src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
        inspectBrk: true,
        fileParallelism: false,
        browser: {
            provider: playwright(),
            instances: [{ browser: 'chromium' }]
        },
    },
})