import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
    // Increase timeout for tests that record HTTP interactions
    testTimeout: 30000,
    hookTimeout: 30000,
    // Enable globals if needed
    globals: false,
    // Setup files for Polly.js if you want global setup
    setupFiles: ["./src/test/polly-global-setup.ts"],
    // Custom snapshot serializers to sanitize sensitive data
    // snapshotSerializers: ["./src/test/snapshot-serializer.ts"],
  },
}));
