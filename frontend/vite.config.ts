import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, '.', '')
  
  const basePath = env.VITE_BASE_PATH ?? './';

  return {
    plugins: [react(), tailwindcss()],
    // Allow publish script to override the base path via VITE_BASE_PATH.
    // Falls back to './' for local development.
    base: basePath,
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  }
})
