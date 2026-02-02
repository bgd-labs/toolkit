import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true,
  sourcemap: true,
  entry: {
    index: "src/index.ts",
    browser: "src/browser.ts"
  },
  format: ["esm"],
  dts: {
    resolve: true
  },
  clean: true,
});
