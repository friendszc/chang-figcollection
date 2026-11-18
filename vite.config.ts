import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// @ts-expect-error Local Node-only development middleware.
import { localApi } from './server/local.mjs';
export default defineConfig(({mode})=>({
 base: mode === 'pages' ? './' : '/',
 build: { outDir: mode === 'pages' ? 'dist-pages' : 'dist' },
 plugins: [react(), tailwindcss(), localApi()]
}));
