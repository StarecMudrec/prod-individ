var _a;
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import wasm from 'vite-plugin-wasm';
var githubRepo = (_a = process.env.GITHUB_REPOSITORY) === null || _a === void 0 ? void 0 : _a.split('/')[1];
var githubPagesBase = githubRepo ? "/".concat(githubRepo, "/") : '/';
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
});
