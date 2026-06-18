import { defineConfig } from 'vite';

// Relative asset paths so the build drops straight onto GitHub Pages
// (shetlandj.github.io/<repo>/) without needing to know the repo slug.
//
// Multi-page build: the home page plus the standalone share-card page.
// Input paths are relative to the project root. (The hand-authored static
// pages in public/ are copied across as-is.)
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        share: 'share.html',
      },
    },
  },
});
