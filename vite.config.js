import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import wasm from 'vite-plugin-wasm';
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
    base: process.env.CI === 'true' ? './' : '/',
});
