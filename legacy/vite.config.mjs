import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

// Multi-page static site: every HTML page is a build entry so it is
// emitted to dist/ with its CSS/JS/assets bundled and hashed.
export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        about: fileURLToPath(new URL("./about.html", import.meta.url)),
        projects: fileURLToPath(new URL("./projects.html", import.meta.url)),
        roadmap: fileURLToPath(new URL("./roadmap.html", import.meta.url)),
        "project-mcp": fileURLToPath(new URL("./project-mcp.html", import.meta.url)),
        "project-neural": fileURLToPath(new URL("./project-neural.html", import.meta.url)),
        "project-rei": fileURLToPath(new URL("./project-rei.html", import.meta.url)),
      },
    },
  },
});
