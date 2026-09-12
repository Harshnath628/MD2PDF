import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    watch: {
      // Office locks .tmp files in outputs/ while a comparison docx is open.
      // Vite watching those files crashes the dev server with EBUSY on Windows.
      ignored: ['**/outputs/**', '**/tmp/**', '**/*.tmp'],
    },
  },
});
