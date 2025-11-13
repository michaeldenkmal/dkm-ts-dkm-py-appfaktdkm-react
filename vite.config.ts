// vite.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineConfig({
    base: "/dkmfaktfe/",
    plugins: [
        react(),
        tailwindcss(),
    ],
    test: {
        globals: true,          // erlaubt expect(), describe(), etc. ohne Import
        environment: "jsdom",   // für DOM-basierte Tests (React)
        setupFiles: "./src/setupTests.ts", // optional für @testing-library/jest-dom
    },
    build: {
        outDir: resolve(__dirname, 'dist'),
        sourcemap: true,
        emptyOutDir: true,
        //manifest: true,
        // rollupOptions: {
        //     input: {
        //         // jeder "Entry" ist eine eigene Seite/ein eigenes Widget
        //         rechnungEdit: resolve(__dirname, 'src/main.tsx'),
        //         // kundeNeu: resolve(__dirname, 'src/kundeNeuEntry.tsx'),
        //         // dashboard: resolve(__dirname, 'src/dashboardEntry.tsx'),
        //     }
        // }
    }
});
