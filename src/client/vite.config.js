import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      pwaAssets: { disabled: false, config: true},
      manifest: {
        name: 'Me vs Yall',
        short_name: 'Me vs Yall',
        description: 'The ultimate sports pick\'em game.  Me vs Yall is a fun and entertaining way to analyze teams and players in the pursuit of correctly guessing who will win.  It will help you outwit others around the world and beat vegas for money.',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,svg,ico}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: false,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        /* when using generateSW the PWA plugin will switch to classic */
        type: 'module',
      },
    })
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
});