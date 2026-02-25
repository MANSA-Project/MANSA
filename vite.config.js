/**
 * MANSA - Vite Configuration
 * https://vitejs.dev/config/
 */

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import legacy from '@vitejs/plugin-legacy';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Load env file based on mode — reads .env.* from __dirname (project root)
  const env = loadEnv(mode, __dirname, '');

  return {
    // ─── No custom root ──────────────────────────────────────────────────────
    // Vite default is process.cwd() — index.html lives at the project root
    // (next to vite.config.js). This is the standard Vite pattern.
    // Build output: dist/index.html — correct, no workarounds needed.

    // ─── Static assets directory ──────────────────────────────────────────
    // Files here are served as-is and copied directly to dist/.
    // public/assets/icons/  →  dist/assets/icons/  (PWA icons — Phase 14)
    // public/assets/fonts/  →  dist/assets/fonts/
    // public/assets/images/ →  dist/assets/images/
    // DO NOT put index.html here — it must stay at the project root.
    publicDir: resolve(__dirname, 'public'),

    // Base public path
    base: '/',

    // Development server config
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      host: true, // Listen on all addresses
      open: true, // Open browser automatically
      cors: true,
      strictPort: false, // Try next port if 3000 is taken

      // Proxy API requests
      // ⚠️  MANSA has no backend server — there is no API to proxy.
      // This block is intentionally empty. Do not add proxy rules here unless
      // a server-side function endpoint is introduced (V1.0+ AI proxy).
      proxy: {},
    },

    // Preview server (for testing production build)
    preview: {
      port: 4173, // Vite default — avoids conflict with Firebase Emulator UI (port 4000)
      host: true,
      open: true,
    },

    // Build configuration
    build: {
      outDir: 'dist', // default — resolves relative to project root (correct)
      assetsDir: 'assets',
      emptyOutDir: true,

      // Source maps (disable in production for security)
      sourcemap: mode === 'development',

      // Rollup options
      rollupOptions: {
        input: {
          // ─── SPA Entry Point ──────────────────────────────────────────────
          // index.html is at the project root — standard Vite location.
          // Phase 9: fill in index.html with <script type="module" src="/src/js/main.js">
          // TODO Phase 16: add admin: resolve(__dirname, 'public/admin.html') when created
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          // Manual chunks for better caching
          // Note: firebase chunks will populate once main.js imports firebase services (Phase 9)
          manualChunks: {
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          },
          // Asset naming for cache busting
          assetFileNames: assetInfo => {
            let extType = assetInfo.name.split('.').pop();
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'images';
            } else if (/woff|woff2|ttf|otf/i.test(extType)) {
              extType = 'fonts';
            }
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },

      // Minification — esbuild (Vite default, ~20x faster than terser)
      // esbuild handles console stripping via the top-level `esbuild` option below.
      // No extra dependency needed.
      minify: mode === 'production' ? 'esbuild' : false,

      // Chunk size warning limit (KB)
      chunkSizeWarningLimit: 1000,

      // CSS code splitting
      cssCodeSplit: true,

      // Asset inline limit (smaller files will be inlined as base64)
      assetsInlineLimit: 4096, // 4KB
    },

    // esbuild transform options (applies to both transpilation and minification)
    esbuild: {
      // Remove all comments from production bundles
      legalComments: mode === 'production' ? 'none' : 'inline',

      // Remove debugger statements in production
      drop: mode === 'production' ? ['debugger'] : [],

      // Mark dev-only console methods as pure so esbuild tree-shakes them.
      // ⚠️  console.warn and console.error are intentionally NOT listed here —
      //     they are the only console methods allowed by our ESLint config
      //     and are needed for runtime error reporting in production.
      pure: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
    },

    // Plugins
    plugins: [
      // PWA Plugin
      VitePWA({
        registerType: 'autoUpdate',
        // ⚠️  Phase 14: populate includeAssets once favicon.ico, robots.txt,
        // and apple-touch-icon.png exist in a static assets dir.
        // With publicDir: false these files are never copied to dist/,
        // so listing them here would make the service worker try to precache
        // URLs that return 404, causing SW installation to fail.
        includeAssets: [],
        manifest: {
          name: 'MANSA - منصة تعليمية',
          short_name: 'MANSA',
          description: 'منصة تعليمية تفاعلية لطلاب الجامعة',
          theme_color: '#667eea',
          // ⚠️  Phase 14: create the actual icon files and restore these entries.
          // The paths below are correct but the files don't exist yet.
          // An empty icons array prevents SW install failures in the meantime.
          icons: [],
        },
        workbox: {
          // Service Worker options
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),

      // Legacy browser support (modern browsers only, no IE 11)
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
    ],

    // Resolve aliases (for cleaner imports)
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '@js': resolve(__dirname, './src/js'),
        '@css': resolve(__dirname, './src/css'),
        '@config': resolve(__dirname, './src/js/config'),
        '@utils': resolve(__dirname, './src/js/utils'),
        '@components': resolve(__dirname, './src/js/components'),
        '@features': resolve(__dirname, './src/js/features'),
      },
    },

    // CSS options
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        // Add global SCSS variables/mixins if needed
        // scss: {
        //   additionalData: `@import "@/css/variables.scss";`
        // }
      },
    },

    // Dependency optimization
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
      exclude: [], // Packages to not pre-bundle
    },

    // Environment variable prefix (only these will be exposed to client)
    envPrefix: 'VITE_',

    // Logging level
    logLevel: 'info',

    // Clear screen on rebuild (dev mode)
    clearScreen: true,

    // ─── Vitest Configuration ─────────────────────────────────────────────
    test: {
      globals: true, // no need to import describe/it/expect in test files
      environment: 'node', // regex/pure-JS tests don't need a DOM
      include: ['tests/**/*.test.js'],
    },
  };
});
