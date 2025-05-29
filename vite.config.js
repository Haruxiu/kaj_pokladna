import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/kaj_pokladna",
  server: {
    port: 3000
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
}) 