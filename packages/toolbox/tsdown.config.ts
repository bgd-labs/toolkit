import { defineConfig } from "tsdown";

export default defineConfig([
  {
    exports: true,
    sourcemap: true,
    entry: {
      index: "src/index.ts",
    },
    platform: "node",
    format: ["esm"],
    dts: {
      resolve: true,
    },
    clean: true,
  },
  {
    exports: true,
    sourcemap: true,
    entry: {
      browser: "src/browser.ts",
    },
    platform: "browser",
    format: ["esm"],
    dts: {
      resolve: true,
    },
    clean: true,
  },
]);
