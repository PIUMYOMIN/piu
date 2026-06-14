import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function spaFallbackPlugin() {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const outDir = resolve(__dirname, 'dist')
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  base: "/",
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('react-quill') || id.includes('quill')) return 'editor';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('swiper')) return 'swiper';
          if (id.includes('aos')) return 'aos';
          if (id.includes('react-icons')) return 'icons';
          if (id.includes('react-toastify')) return 'toast';
          if (id.includes('axios')) return 'http';
          if (
            id.includes('react-dom') ||
            id.includes('react-router') ||
            id.includes('/react/')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
});
