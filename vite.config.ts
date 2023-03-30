import path from 'path';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
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
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        iframe: path.resolve(__dirname, 'example/iframe.html')
      },
      output: {
        manualChunks: {
          echarts: ['echarts'],
          ahooks: ['ahooks'],
          moment: ['moment']
        }
      }
    },
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    visualizer()
  ]
});
