import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  // En production : aucun console.* ni debugger dans le bundle
  esbuild: mode === 'production' ? { drop: ['console', 'debugger'] } : {},
  server: {
    port: 5173,
    // npm run dev ouvre le navigateur directement sur l'accueil
    open: '/',
    strictPort: false,
    proxy: {
      '/api': {
        target: 'https://le-gba-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.{js,jsx}'],
    restoreMocks: true,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      // Commentaires internes de Zod que Rollup ignore : avertissement sans conséquence
      onwarn(warning, warn) {
        if (warning.code === 'INVALID_ANNOTATION' && warning.id?.includes('node_modules/zod'))
          return;
        warn(warning);
      },
      output: {
        // Bibliothèques dans des fichiers séparés : mieux mis en cache par le navigateur
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
}));
