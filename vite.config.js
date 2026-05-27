import { defineConfig } from 'vite';

// Relative asset paths so the build drops straight onto GitHub Pages
// (shetlandj.github.io/<repo>/) without needing to know the repo slug.
export default defineConfig({
  base: './',
});
