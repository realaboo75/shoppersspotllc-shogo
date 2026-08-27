import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/postcss'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(rootDir, './src') } },
  css: { postcss: { plugins: [tailwindcss()] } },
  server: { host: '0.0.0.0', port: 8080, strictPort: true, allowedHosts: ['localhost', '127.0.0.1'] },
})
