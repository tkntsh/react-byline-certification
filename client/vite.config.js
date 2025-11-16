import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration for React development
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  // Production build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Optimize build size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          axios: ['axios']
        }
      }
    }
  }
})

