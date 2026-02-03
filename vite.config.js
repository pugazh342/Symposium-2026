import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/symposium-2026/", // ⚠️ ADD THIS LINE (Match your Repo Name exactly)
})
