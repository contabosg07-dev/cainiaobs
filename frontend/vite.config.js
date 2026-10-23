import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import fs from 'fs';

// 本地 HTTPS 证书（key.pem / cert.pem）仅用于开发，不提交到仓库；
// 文件不存在时自动退回 HTTP，不影响构建。
const hasDevCerts = fs.existsSync('./key.pem') && fs.existsSync('./cert.pem');

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    ...(hasDevCerts && {
      https: {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem'),
      },
    }),
    proxy: {
      '/api': {
        target: 'http://localhost:8787', // 本地 Cloudflare Worker（wrangler dev）
        changeOrigin: true,
      },
    },
  },
});
