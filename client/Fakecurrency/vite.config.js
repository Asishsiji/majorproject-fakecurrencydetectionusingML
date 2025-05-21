import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Fake currency detection",
        short_name: "",
        description: "your shield against fake currency.",
        icons: [
          {
            src: "/web-app-manifest-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/web-app-manifest-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        theme_color: "#000000",
        background_color: "#121212",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
      workbox: {
        globDirectory: "dist", // ✅ Ensure it's pointing to the correct folder
        globPatterns: ["**/*.{js,css,html,png,svg,ico,woff2}"], // ✅ Added more common asset types
        globIgnores: ["node_modules/**/*", "sw.js", "workbox-*.js"],
      },
    }),
  ],
});
