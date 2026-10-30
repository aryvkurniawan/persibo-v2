import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://persibo.com',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['www.ileague.id'], // Allow external images from iLeague
  },
  build: {
    inlineStylesheets: 'auto', // Inline small CSS files automatically
    assets: '_assets',
  },
  vite: {
    css: {
      // Optimize CSS loading
      devSourcemap: false,
    },
    build: {
      cssCodeSplit: false, // Reduce CSS chunks to minimize dependency chain
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          // Reduce chunk splitting to minimize dependency chain
          manualChunks: undefined,
        },
      },
    },
  },
  integrations: [
    sitemap({
      // Throwaway design prototypes must not be indexed or deployed as real pages.
      filter: (page) => !page.includes('/proto-'),
    }),
  ],
});
