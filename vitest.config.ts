import { defineConfig } from "vitest/config";
import path from "node:path";

// Cockpit unit tests only. Pure logic — no DOM, no network. The cadence engine
// deliberately has zero framework dependencies so these run fast and offline.
export default defineConfig({
  test: {
    include: ["src/cockpit/**/*.test.ts"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
