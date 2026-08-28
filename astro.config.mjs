import { defineConfig } from 'astro/config';
import { remarkI18n } from './src/plugins/remark-i18n.mjs';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  site: 'https://x4yii.github.io',
  base: '/xhub',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkI18n]
  },
  vite: {
    plugins: [
      ViteImageOptimizer({
        // Optimal settings for lossless / very high quality WebP and PNG optimization
        png: { quality: 85 },
        jpeg: { quality: 85 },
        jpg: { quality: 85 },
        webp: { lossless: true }
      })
    ]
  },
  devToolbar: {
    enabled: false
  }
});