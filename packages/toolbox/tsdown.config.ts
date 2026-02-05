import { defineConfig } from "tsdown";

export default defineConfig([
  {
    exports: false,
    sourcemap: true,
    entry: {
      index: "src/index.ts",
    },
    platform: "node",
    format: ["esm"],
    dts: true,
    clean: true,
    inlineOnly: false,
  },
  {
    exports: false,
    sourcemap: true,
    entry: {
      browser: "src/browser.ts",
    },
    platform: "browser",
    format: ["esm"],
    dts: true,
    clean: true,
    inlineOnly: false,
  },
]);
