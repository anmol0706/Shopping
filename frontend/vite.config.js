import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      future: {
        v7_relativeSplatPath: true
      }
    }),
    tailwindcss()
  ],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Ensure SPA routing works in production
  preview: {
    port: 5173,
    host: true
  }
})
