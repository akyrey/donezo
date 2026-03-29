import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    wayfinder(),
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      refresh: true,
      ssr: 'resources/js/ssr.tsx',
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'resources/js'),
    },
  },
  server: {
    host: '0.0.0.0',
    watch: {
      ignored: ['**/storage/framework/views/**'],
    },
  },
});
