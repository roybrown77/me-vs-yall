import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { minimal2023Preset } from '@vite-pwa/assets-generator/config';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isDevServer = command === 'serve';

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        themeColor: '#f5fffa',
        pwaAssets: {
          disabled: false,
          config: false,
          preset: minimal2023Preset,
          image: 'public/favicon.png',
          htmlPreset: '2023',
        },
        manifest: {
          name: 'Me vs Yall',
          short_name: 'Me vs Yall',
          description: 'The ultimate sports pick\'em game.  Me vs Yall is a fun and entertaining way to analyze teams and players in the pursuit of correctly guessing who will win.  It will help you outwit others around the world and beat vegas for money.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          theme_color: '#f5fffa',
          background_color: '#f5fffa',
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
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,svg,ico}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
        },
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
    outDir: 'build'
  },
  envPrefix: 'REACT_APP_',
  };
});