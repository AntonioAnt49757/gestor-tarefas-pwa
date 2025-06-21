import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    host: 'localhost'
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['lit']
  }
});