# Install

https://chatgpt.com/c/6903a886-fa54-832a-8050-f458d408afb9

```bash
yarn add -D vitest @vitest/ui @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

# vite.config.ts anpassen

````typescript

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,          // erlaubt expect(), describe(), etc. ohne Import
    environment: "jsdom",   // für DOM-basierte Tests (React)
    setupFiles: "./src/setupTests.ts", // optional für @testing-library/jest-dom
  },
});
````

ACHTUNG: der import von defineConfig muss angepaßt werden 

```typescript
import { defineConfig } from "vitest/config";

```
# Setup-Datei erstellen

src/setupTests.ts:

````typescript
import "@testing-library/jest-dom";
````

# Beispiel-Testdatei

```typescript
import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders headline", () => {
  render(<App />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});

```

Vite tests sind syntaxkompatibel zu Jest

# package.json

```json
"scripts": {
   ...
    "manual_test": "vite --config vitest.config.ts",
...
  },
```