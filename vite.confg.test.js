"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
exports.default = (0, vite_1.defineConfig)({
    root: "manual_tests",
    server: {
        port: 5177,
        strictPort: true,
        // Sehr wichtig für Django-Cookies/CORS:
        proxy: {
            // Alles was mit /api/... aufgerufen wird, geht an Django Dev Server
            // und der Browser sieht es trotzdem als gleiche Origin.
            "/dkmfakt": {
                target: "http://localhost:8000",
                changeOrigin: true,
                secure: false
            }
        }
    }
});
