const {
  defineConfig,
  minimal2023Preset,
} = require('@vite-pwa/assets-generator/config');

module.exports = defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: minimal2023Preset,
  images: ['public/favicon.png'],
});
