import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import list from '../views/list.vue';
import homepage from '../views/homepage.vue';
import send from '../views/send.vue';
import pac from '../views/packa1ge.vue';
import global from '../views/global.vue';
import sfm from '../views/sfm.vue';
import scan from '../views/scan.vue';
import ExchangePlaza from '../views/cainiao/ExchangePlaza.vue';
import adminlogin from '../views/adminlogin.vue';
import AdminLayout from '../layout/AdminLayout.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import Users from '../views/admin/Users.vue';
import Packages from '../views/admin/Packages.vue';
import Stations from '../views/admin/Stations.vue';
import { validateToken } from '../utils/authExpired';

const publicPaths = ['/', '/register', '/adminlogin', '/demo/plaza'];

const routes = [
  { path: '/', meta: { title: '菜鸟驿站' }, name: 'Login', component: Login },
  { path: '/register', meta: { title: '注册' }, name: 'Register', component: Register },
  { path: '/list', name: 'list', meta: { title: '用户管理' }, component: list },
  { path: '/home', name: 'homepage', meta: { title: '首页' }, component: homepage },
  { path: '/send', name: 'send', component: send },
  { path: '/pac', meta: { title: '包裹管理' }, component: pac },
  { path: '/global', name: 'global', component: global },
  { path: '/scan', name: 'scan', component: scan },
  { path: '/sfm', name: 'sfm', component: sfm },
  { path: '/demo/plaza', name: 'demo-plaza', meta: { title: '闲置交换广场' }, component: ExchangePlaza },
  { path: '/adminlogin', name: 'adminlogin', meta: { title: '管理员登录' }, component: adminlogin },
  // 后台管理
  {
    path: '/admin',
    component: AdminLayout,
    meta: { title: '管理后台' },
    redirect: '/admin/dashboard',
    children: [
      { path: 'dashboard', name: 'AdminDashboard', meta: { title: '数据看板', requireAdmin: true }, component: Dashboard },
      { path: 'users', name: 'AdminUsers', meta: { title: '用户管理', requireAdmin: true }, component: Users },
      { path: 'packages', name: 'AdminPackages', meta: { title: '快递管理', requireAdmin: true }, component: Packages },
      { path: 'stations', name: 'AdminStations', meta: { title: '驿站管理', requireAdmin: true }, component: Stations },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  // 后台需要管理员登录
  if (to.meta.requireAdmin) {
    if (!token || username !== 'admin') {
      next({ path: '/adminlogin' });
      return;
    }
    const isValid = await validateToken();
    if (!isValid) {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      next({ path: '/adminlogin' });
      return;
    }
    next();
    return;
  }

  // 其它非公开页需要登录
  if (!publicPaths.includes(to.path) && !token) {
    next({ path: '/', query: { redirect: to.fullPath } });
    return;
  }
  if (!publicPaths.includes(to.path) && token) {
    const isValid = await validateToken();
    if (!isValid) {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      next({ path: '/', query: { redirect: to.fullPath } });
      return;
    }
  }
  next();
});

export default router;
