import { defineConfig } from 'astro/config';
import { remarkI18n } from './src/plugins/remark-i18n.mjs';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://x4yii.github.io',
  base: '/xhub',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkI18n]
  },
  vite: {
    plugins: [
      ViteImageOptimizer({
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