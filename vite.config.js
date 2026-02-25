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
  // Load env file based on mode
  const env = loadEnv(mode, __dirname, '');

  return {
    // ─── Project root (where index.html lives) ────────────────────────────────
    // Setting root to 'public/' means Vite finds index.html at the correct location
    // AND outputs to dist/index.html instead of dist/public/index.html.
    // All src/ imports still work because aliases use absolute resolve() paths.
    root: resolve(__dirname, 'public'),

    // Static assets that bypass Vite processing (robots.txt, offline.html, etc.)
    // Set false for now — no files here yet. Enable + point to a dir in Phase 14 (PWA).
    publicDir: false,

    // Base public path
    base: '/',

    // Development server config
    server: {
      port: parseInt(env.VITE_PORT) || 3000,
      host: true, // Listen on all addresses
      open: true, // Open browser automatically
      cors: true,
      strictPort: false, // Try next port if 3000 is taken

      // Proxy API requests (if needed)
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },

    // Preview server (for testing production build)
    preview: {
      port: 4173, // Vite default — avoids conflict with Firebase Emulator UI (port 4000)
      host: true,
      open: true,
    },

    // Build configuration
    build: {
      // Absolute path needed because root is 'public/' — relative 'dist' would
      // resolve to public/dist/ instead of the project root dist/.
      outDir: resolve(__dirname, 'dist'),
      assetsDir: 'assets',
      emptyOutDir: true,

      // Source maps (disable in production for security)
      sourcemap: mode === 'development',

      // Rollup options
      rollupOptions: {
        input: {
          // ─── SPA Entry Point ──────────────────────────────────────────────
          // Single entry for now (SPA handles routing internally via hash router)
          // TODO Phase 9: main entry is public/index.html
          // TODO Phase 16: add admin: resolve(__dirname, 'public/admin.html') when created
          main: resolve(__dirname, 'public/index.html'),
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

      // Minification
      minify: 'terser',
      terserOptions: {
        compress: {
          // ⚠️  Never use drop_console: true — it removes ALL console calls including
          // console.warn and console.error which are the intentionally allowed methods
          // for production error reporting (see ESLint no-console rule).
          // Instead, strip only development-only methods via pure_funcs.
          drop_console: false,
          drop_debugger: true,
          // console.warn and console.error are preserved intentionally.
          // console.log / console.debug / console.info are development-only.
          pure_funcs: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
        },
        format: {
          comments: false, // Remove comments
        },
      },

      // Chunk size warning limit (KB)
      chunkSizeWarningLimit: 1000,

      // CSS code splitting
      cssCodeSplit: true,

      // Asset inline limit (smaller files will be inlined as base64)
      assetsInlineLimit: 4096, // 4KB
    },

    // Plugins
    plugins: [
      // PWA Plugin
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'MANSA - منصة تعليمية',
          short_name: 'MANSA',
          description: 'منصة تعليمية تفاعلية لطلاب الجامعة',
          theme_color: '#667eea',
          icons: [
            {
              src: 'assets/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'assets/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
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
      // Explicit root keeps tests anchored to the project root, not the Vite
      // root (public/). Without this, 'tests/**/*.test.js' would resolve to
      // 'public/tests/**/*.test.js' which doesn't exist.
      root: __dirname,
      globals: true, // no need to import describe/it/expect in test files
      environment: 'node', // regex/pure-JS tests don't need a DOM
      include: ['tests/**/*.test.js'],
    },
  };
});
