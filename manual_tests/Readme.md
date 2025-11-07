# install

# build

```cmd
vite
```

# vite.config.ts

```javascript
import { defineConfig } from "vite";

export default defineConfig({
    // Verzeichnis, wo index.html liegt
    // und auch die tsconfig.json
    root:"manual_tests",
    server: {
        port: 5173,
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

```

# tsconfig

durch den Eintr
# index.html

