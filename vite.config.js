import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        background_color: "#ffffff",
        categories: ["hogar", "trabajo"],
        description:
          "Esta es una PWA para Crear listas simples",
        dir: "ltr",
        display_override: ["standalone", "fullscreen"],
        display: "standalone",
        scope: "/",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        lang: "es-MX",
        name: "PWA Listas Simples",
        orientation: "portrait",
        prefer_related_application: false,
        short_name: "PWA Listas",
        start_url: "/gastodeldia/",
        theme_color: "#317EFB",
      },
    }),
  ],
  server: {
    host: true,
  },
  base: "/gastodeldia/",
});
