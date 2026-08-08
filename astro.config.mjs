import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  output: 'static',
  site: 'https://exitz.me',
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: { enabled: true },
  }),
  vite: {
    ssr: {
      external: ['@resvg/resvg-js'],
    },
  },
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: ['noopener', 'noreferrer'],
        },
      ],
    ],
  },
});