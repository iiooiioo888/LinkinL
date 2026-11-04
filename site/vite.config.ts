import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/LinkinL/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: '../docs', dest: '.' },
        { src: '../scripts', dest: '.' },
        { src: '../README.md', dest: '.' },
        { src: '../.env.linkinl.example', dest: '.' },
      ],
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor-react';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'vendor-motion';
          if (id.includes('node_modules/chart.js')) return 'vendor-chart';
          if (id.includes('/src/sim/')) return 'sim-core';
          if (id.includes('/src/legacy/main-content')) return 'content-main';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  worker: {
    format: 'es',
  },
});
