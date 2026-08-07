import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  output: 'static',
  site: 'https://exitz.me',
  adapter: netlify(),
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