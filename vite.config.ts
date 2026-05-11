/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/react-pokemon/",
  build: {
    sourcemap: true
  },
  resolve: {
    alias: {
      "@app": path.resolve(dirname, "./src/app"),
      "@shared": path.resolve(dirname, "./src/shared"),
      "@core": path.resolve(dirname, "./src/core"),
      "@features": path.resolve(dirname, "./src/features"),
      "@layouts": path.resolve(dirname, "./src/layouts")
    }
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx,js,jsx}"],
      exclude: [
        // Entry points
        "src/index.{ts,tsx,js}",
        "src/reportWebVitals.ts",
        // Barrel files (re-exports only)
        "src/**/index.{ts,tsx,js}",
        // Pure type/interface files (no runtime code)
        "src/**/*.d.ts",
        "src/**/api.types.ts",
        "src/**/models.ts",
        // App wiring & infrastructure (not business logic)
        "src/app/providers.tsx",
        "src/app/router.tsx",
        "src/layouts/MainLayout.tsx",
        // shadcn auto-generated UI primitives
        "src/shared/ui/components/ui/**",
        // Legacy .jsx files being migrated to .tsx
        "src/**/*.jsx",
        // View layer: pages and display components (tested via snapshots only)
        "src/app/App.tsx",
        "src/**/pages/**",
        "src/features/**/components/**",
        "src/shared/ui/components/**",
        // Test helpers
        "src/**/test-utils/**",
        // Test setup & stories
        "src/setupTests.ts",
        "src/**/*.stories.{ts,tsx,js,jsx}"
      ],
      reporter: ["text", "html", "lcov"],
      thresholds: {
        lines: 80,
        functions: 80
      }
    },
    projects: [{
      extends: true,
      test: {
        name: "unit",
        environment: "jsdom",
        environmentOptions: { url: "http://localhost" },
        globals: true,
        setupFiles: "./src/setupTests.ts",
        exclude: ["src/__tests__/e2e/**", "node_modules/**"]
      }
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});