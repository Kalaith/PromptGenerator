import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
const basePath = process.env.VITE_BASE_PATH ?? './';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Allow publish script to override the base path via VITE_BASE_PATH.
  // Falls back to './' for local development.
  base: basePath,
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
