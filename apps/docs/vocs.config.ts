import { defineConfig } from "vocs";
import { sidebar } from "./sidebar";

export default defineConfig({
  rootDir: ".",
  title: "BGD Labs",
  sidebar,
  topNav: [{ text: "Docs", link: "/docs/getting-started", match: "/docs" }],
});
