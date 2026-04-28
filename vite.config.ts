import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import wasm from 'vite-plugin-wasm'

const githubRepo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const githubPagesBase = githubRepo ? `/${githubRepo}/` : '/'

export default defineConfig({
  plugins: [vue(), wasm()],
  publicDir: 'static',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'public',
    emptyOutDir: true,
    sourcemap: false,
    target: 'esnext',
  },
  base: process.env.GITHUB_ACTIONS === 'true' ? githubPagesBase : '/',
})