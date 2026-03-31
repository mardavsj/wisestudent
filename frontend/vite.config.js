import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { mkdir, readdir, rm, writeFile, copyFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const analyzeBundle = (import.meta.env?.VITE_ANALYZE || 'false').toLowerCase() === 'true';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcLocalesRoot = path.join(__dirname, "src", "locales");
const publicLocalesRoot = path.join(__dirname, "public", "locales");
const localesManifestPath = path.join(__dirname, "public", "locales-manifest.json");

const PAGE_GAMES_RE = /^([^/]+)\/pages\/games\/([^/]+)\/([^/]+)\.json$/;
const PAGE_CARDS_RE = /^([^/]+)\/pages\/cardcontent\/([^/]+)\/([^/]+)\.json$/;
const GAMECONTENT_RE = /^([^/]+)\/gamecontent\/([^/]+)\/([^/]+)\/([^/]+)\.json$/;

const walkJsonFiles = async (dir, root = dir) => {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") {
      console.warn(`[i18n-sync] Locale directory missing, skipping: ${dir}`);
      return [];
    }
    throw error;
  }
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkJsonFiles(absolute, root)));
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
      files.push(path.relative(root, absolute).replaceAll("\\", "/"));
    }
  }

  return files;
};

const buildLocalesManifest = (localeFiles, pathPrefix) => {
  const manifest = {
    generatedAt: new Date().toISOString(),
    pageGamesByLang: {},
    pageCardsByLang: {},
    gamecontentByLang: {},
    availableLanguages: [],
  };
  const languageSet = new Set();

  for (const relativePath of localeFiles) {
    const pageGameMatch = relativePath.match(PAGE_GAMES_RE);
    if (pageGameMatch) {
      const [, lang, pillar, module] = pageGameMatch;
      languageSet.add(lang);
      manifest.pageGamesByLang[lang] = manifest.pageGamesByLang[lang] || [];
      manifest.pageGamesByLang[lang].push({
        pillar,
        module,
        path: `${pathPrefix}/${relativePath}`,
      });
      continue;
    }

    const pageCardMatch = relativePath.match(PAGE_CARDS_RE);
    if (pageCardMatch) {
      const [, lang, pillar, module] = pageCardMatch;
      languageSet.add(lang);
      manifest.pageCardsByLang[lang] = manifest.pageCardsByLang[lang] || [];
      manifest.pageCardsByLang[lang].push({
        pillar,
        module,
        path: `${pathPrefix}/${relativePath}`,
      });
      continue;
    }

    const gamecontentMatch = relativePath.match(GAMECONTENT_RE);
    if (gamecontentMatch) {
      const [, lang, pillar, module, slug] = gamecontentMatch;
      languageSet.add(lang);
      manifest.gamecontentByLang[lang] = manifest.gamecontentByLang[lang] || [];
      manifest.gamecontentByLang[lang].push({
        pillar,
        module,
        slug,
        path: `${pathPrefix}/${relativePath}`,
      });
    }
  }

  manifest.availableLanguages = [...languageSet].sort();
  return manifest;
};

const syncLocalesToPublicForBuild = async () => {
  await rm(publicLocalesRoot, { recursive: true, force: true });
  await mkdir(publicLocalesRoot, { recursive: true });

  try {
    await access(srcLocalesRoot);
  } catch (error) {
    if (error?.code === "ENOENT") {
      const emptyManifest = buildLocalesManifest([], "/locales");
      await writeFile(localesManifestPath, `${JSON.stringify(emptyManifest, null, 2)}\n`, "utf8");
      console.warn("[i18n-sync] src/locales not found. Generated empty locales manifest.");
      return;
    }
    throw error;
  }

  const localeFiles = await walkJsonFiles(srcLocalesRoot);
  localeFiles.sort();

  for (const relativePath of localeFiles) {
    const sourceFile = path.join(srcLocalesRoot, relativePath);
    const targetFile = path.join(publicLocalesRoot, relativePath);
    await mkdir(path.dirname(targetFile), { recursive: true });
    try {
      await copyFile(sourceFile, targetFile);
    } catch (error) {
      if (error?.code === "ENOENT") {
        console.warn(`[i18n-sync] Missing locale file skipped: ${sourceFile}`);
      } else {
        throw error;
      }
    }
  }

  const manifest = buildLocalesManifest(localeFiles, "/locales");
  await writeFile(localesManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
};

const localesManifestDevPlugin = () => {
  let manifestCache = null;
  let manifestDirty = true;
  let inFlight = null;

  const getManifest = async () => {
    if (!manifestDirty && manifestCache) {
      return manifestCache;
    }
    if (!inFlight) {
      inFlight = (async () => {
        const localeFiles = await walkJsonFiles(srcLocalesRoot);
        localeFiles.sort();
        manifestCache = buildLocalesManifest(localeFiles, "/src/locales");
        manifestDirty = false;
        inFlight = null;
        return manifestCache;
      })().catch((error) => {
        inFlight = null;
        throw error;
      });
    }
    return inFlight;
  };

  return {
    name: "dev-locales-manifest",
    apply: "serve",
    configureServer(server) {
      server.watcher.on("all", (_, changedPath) => {
        if (
          changedPath &&
          changedPath.includes(`${path.sep}src${path.sep}locales${path.sep}`) &&
          changedPath.toLowerCase().endsWith(".json")
        ) {
          manifestDirty = true;
        }
      });

      server.middlewares.use("/locales-manifest.json", async (_req, res) => {
        try {
          const manifest = await getManifest();
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(manifest));
        } catch (error) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(
            JSON.stringify(buildLocalesManifest([], "/src/locales"))
          );
          console.warn("[i18n-sync] Failed to build dev locales manifest:", error?.message || error);
        }
      });
    },
  };
};

const localesSyncBuildPlugin = () => ({
  name: "sync-locales-to-public-build",
  apply: "build",
  async buildStart() {
    try {
      await syncLocalesToPublicForBuild();
    } catch (error) {
      console.warn("[i18n-sync] Locale sync failed during build:", error?.message || error);
    }
  },
});

export default defineConfig({
  plugins: [
    localesManifestDevPlugin(),
    localesSyncBuildPlugin(),
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

          // Let Rollup split app code by dynamic-import boundaries.
          // Forced route-wide chunks were creating massive bundles (e.g. student route).
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
