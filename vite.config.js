import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Bundle analyser — generates dist/stats.html after every build (inspect chunk sizes)
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
    }),
  ],

  // Drop console / debugger calls in production via esbuild (no terser install needed)
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },

  build: {
    cssCodeSplit: true,   // Each async chunk gets its own CSS file → faster per-route load
    sourcemap: false,     // No source maps in production → smaller output
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — loaded first, rarely changes → ideal for long-term caching
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/')) {
            return 'react-vendor';
          }
          // Self-hosted fonts — separate chunk, cached long-term
          if (id.includes('@fontsource')) {
            return 'fonts';
          }
          // Everything else from node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Content-hash filenames for perfect long-term caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
}))
