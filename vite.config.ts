import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://mock.apifox.cn/m1/1062627-0-default',
        changeOrigin: true
      }
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) '${path.resolve(__dirname, 'src/assets/css/variables.less')}';`,
        },
        javascriptEnabled: true
      }
    }
  },
  plugins: [react()]
});
