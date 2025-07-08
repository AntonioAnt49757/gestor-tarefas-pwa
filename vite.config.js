import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks: {
          'lit-core': ['lit', '@lit/reactive-element'],
          'lit-html': ['lit-html', 'lit-element']
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  },
  plugins: [
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
});