import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

const analyzeBundle = (import.meta.env?.VITE_ANALYZE || 'false').toLowerCase() === 'true';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    analyzeBundle &&
    visualizer({
      filename: "dist/bundle-analysis.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
      open: false,
    }),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Do not split React into its own chunk: shared modules can create a
            // vendor-react <-> vendor circular dependency, leaving React undefined
            // at runtime (Cannot read properties of undefined (reading 'createContext')).
            if (
              id.includes("chart.js") ||
              id.includes("react-chartjs-2") ||
              id.includes("recharts") ||
              id.includes("react-calendar-heatmap")
            ) {
              return "vendor-charts";
            }
            if (id.includes("i18next") || id.includes("react-i18next")) {
              return "vendor-i18n";
            }
            if (id.includes("socket.io-client") || id.includes("engine.io-client")) {
              return "vendor-socket";
            }
            if (id.includes("framer-motion") || id.includes("animejs")) {
              return "vendor-motion";
            }
            // Keep react-router in the main vendor chunk — a separate "vendor-router"
            // chunk was often empty (~0 kB) while the router code lived in vendor/main.
            return "vendor";
          }

          if (id.includes("/src/pages/Admin/")) return "route-admin";
          if (id.includes("/src/pages/School/")) return "route-school";
          if (id.includes("/src/pages/Student/")) return "route-student";
          if (id.includes("/src/pages/Parent/")) return "route-parent";
          if (id.includes("/src/pages/CSR/")) return "route-csr";
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true, // Listen on all addresses
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
      clientPort: 3000,
      overlay: false, // Disable error overlay for HMR connection issues
    },
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // Suppress connection refused errors - they're handled by the client
            if (err.code === 'ECONNREFUSED') {
              console.warn('⚠️ Backend server not running. Some API calls may fail.');
              // Don't log the full error stack for connection refused
              return;
            }
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', () => {
            // Suppress proxy request logging to reduce console noise
            // Only log errors, not successful proxy requests
          });
        },
      },
    },
  },
  optimizeDeps: {
    exclude: [],
  },
});
