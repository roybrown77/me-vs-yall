import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { minimal2023Preset } from '@vite-pwa/assets-generator/config';

const clientDir = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDevServer = command === 'serve';

  return {
    resolve: {
      alias: {
        'simplex-noise': path.resolve(clientDir, 'src/vendor/simplex-noise/esm/simplex-noise.js'),
      },
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.js',
        injectManifest: {
          globPatterns: ['**/*.{js,css,ico,png,svg,webp,webmanifest,woff2}'],
          globIgnores: ['**/index.html'],
        },
        themeColor: '#FFE8A3',
        pwaAssets: {
          disabled: false,
          config: false,
          preset: minimal2023Preset,
          image: 'public/favicon.png',
          htmlPreset: '2023',
        },
        manifest: {
          id: '/',
          name: 'Me vs Yall',
          short_name: 'Me vs Yall',
          description: 'The ultimate sports pick\'em game.  Me vs Yall is a fun and entertaining way to analyze teams and players in the pursuit of correctly guessing who will win.  It will help you outwit others around the world.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          theme_color: '#FFE8A3',
          background_color: '#FFE8A3',
          screenshots: [
            {
              src: 'screenshots/screenshot-wide.png',
              sizes: '1920x1080',
              type: 'image/png',
              form_factor: 'wide',
            },
            {
              src: 'screenshots/screenshot-mobile.png',
              sizes: '1080x1920',
              type: 'image/png',
            },
          ],
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        // workbox options are used for generateSW; injectManifest uses the custom sw.
        devOptions: {
          enabled: isDevServer,
          navigateFallback: 'index.html',
          suppressWarnings: true,
          /* when using generateSW the PWA plugin will switch to classic */
          type: 'module',
        },
      }),
    ],
  server: {
    open: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist'
  },
  envPrefix: 'REACT_APP_',
  };
});