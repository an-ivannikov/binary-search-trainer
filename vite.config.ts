import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";




// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // change base to "/<repo-name>/" before deploying to GitHub Pages
  base: "/binary-search-trainer/"
});
