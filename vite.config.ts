import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 插件：解析第三方库未捕获插件报错导致 esbuild 无法构建
const resolveFixup = () => {
  return {
    name: 'resolve-fixup',
    setup(build) {
      build.onResolve({ filter: /react-virtualized/ }, async () => {
        return {
          path: path.resolve('./node_modules/react-virtualized/dist/umd/react-virtualized.js'),
        };
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [resolveFixup()]
    }
  },
  plugins: [react()]
});
