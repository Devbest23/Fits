import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// WHY: `base` permite publicar la demo tanto en la raíz como en un subdirectorio
// de GitHub Pages (por ejemplo /Fits/) sin romper los assets.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.VITE_BASE_PATH || '/',
})
