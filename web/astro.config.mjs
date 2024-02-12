import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import yaml from '@rollup/plugin-yaml';

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), svelte()],
  vite: {
    plugins: [yaml()],
  }
});