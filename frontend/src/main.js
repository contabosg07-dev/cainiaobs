import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import { setupAuthExpiredHandler } from './utils/authExpired';
import axios from 'axios';

// 生产环境由 Pages 的环境变量 VITE_API_BASE 指定 Worker 地址；本地留空走 vite 代理
// 清洗误粘贴的引号/反引号/空白
axios.defaults.baseURL = (import.meta.env.VITE_API_BASE || '').trim().replace(/^[`'"]+|[`'"]+$/g, '');

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(ElementPlus);

setupAuthExpiredHandler(router);
app.use(router);

// 注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
