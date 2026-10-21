import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.christopherfrendo.com',
  output: 'static',
  build: {
    format: 'directory',
  },
});
