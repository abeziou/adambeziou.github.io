// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';

export default defineConfig({
  site: 'https://abeziou.dev',
  integrations: [
    sanity({
      projectId: "japwn6x8",
      dataset: "production",
      useCdn: false,
    }),
  ],
});