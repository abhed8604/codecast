import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The client lives in ./client but its node_modules are hoisted to the repo root.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // Frontend and backend share one origin in dev — no CORS anywhere.
      '/api': 'http://localhost:3002',
    },
  },
  build: {
    outDir: 'dist',
    // Monaco is large; keep the warning from firing at our intentional split.
    chunkSizeWarningLimit: 1500,
  },
})
