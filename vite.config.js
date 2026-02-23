/**
 * MANSA - Vite Configuration
 * https://vitejs.dev/config/
 */

import { resolve } from 'path';

import legacy from '@vitejs/plugin-legacy';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
      port: 4000,
      host: true,
      open: true,
    },

    // Build configuration
    build: {
      outDir: 'dist',
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
          manualChunks: {
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            vendor: ['workbox-window'],
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
          drop_console: mode === 'production', // Remove console.log in production
          drop_debugger: true,
          pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
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

      // Legacy browser support (IE11, older browsers)
      legacy({
        targets: ['defaults', 'not IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
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
