// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: "./", // Ensures paths work properly on Vercel
//   optimizeDeps: {
//     exclude: ["lucide-react"],
//   },
//   server: {
//     hmr: {
//       overlay: false,
//     },
//   },
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./", // Change "/" to "./" to fix asset paths
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
