import { defineConfig } from "tsup";

export default defineConfig({
  sourcemap: true,
  entry: ["src/index.ts"],
  target: "node22",
  format: ["esm"],
  dts: false,
  splitting: false,
});
