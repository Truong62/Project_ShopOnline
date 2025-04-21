import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    proxy: {
      '/api': {
        target: 'https://18.139.41.39:444',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    port: 8386,
  },
  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    tsconfigRaw: {
      compilerOptions: {
        skipLibCheck: true,
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },
  base: '/',
});
