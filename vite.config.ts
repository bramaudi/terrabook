import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import path from 'path'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      ignored: ['**/android/**']
    }
  }
});
