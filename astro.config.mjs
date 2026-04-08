// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkWikilinks } from './src/plugins/remark-wikilinks.mjs';

export default defineConfig({
  site: 'https://eliotattridge.com',
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkWikilinks],
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
