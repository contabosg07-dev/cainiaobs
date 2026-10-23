<template>
  <div class="home-page">

    <div class="top-banner">
      <div class="user-bar">
        <div class="greeting">
          <el-icon><User /></el-icon>
          <span>你好，{{ userStore.username }}</span>
        </div>
        <div class="user-actions">
          <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99" class="bell-badge">
            <el-icon :size="22" class="bell" @click="openNotifications"><Bell /></el-icon>
          </el-badge>
          <el-dropdown @command="onUserCommand">
            <span class="user-menu">
              账号设置 <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <el-input
        class="search-bar"
        v-model="keyword"
        placeholder="搜索单号 / 快递公司 / 驿站"
        :prefix-icon="Search"
        size="large"
        clearable
      />
      <div class="main-functions">
        <div class="func-item" @click="fetchPackages">
          <img :src="receiveIcon" class="func-icon" />
          <div class="func-text">取包裹</div>
        </div>
        <router-link to="/send" class="no-underline"><div class="func-item">
          <img :src="sendIcon" class="func-icon" />
          <div class="func-text">寄包裹</div>
        </div></router-link>
        <router-link to="/demo/plaza" class="no-underline"><div class="func-item">
          <img :src="swapIcon" class="func-icon" />
          <div class="func-text">物换物</div>
        </div></router-link>
        <div class="func-item" @click="sfm">
          <img :src="outcodeIcon" class="func-icon" />
          <div class="func-text">出库码</div>
        </div>
      </div>
    </div>


    <div class="white-card">
      <div class="feature-scroll-bar">
        <div class="feature-item">
          <img :src="points" class="feature-icon" />
          <div class="feature-text">裹酱积分</div>
        </div>
        <div class="feature-item">
          <img :src="recycle" class="feature-icon" />
          <div class="feature-text">菜鸟回收</div>
        </div>
        <div class="feature-item" @click="gotoglobal">
          <img :src="global" class="feature-icon" />
          <div class="feature-text">低价寄全球</div>
        </div>
        <div class="feature-item">
          <img :src="save" class="feature-icon" />
          <div class="feature-text">越买越省钱</div>
        </div>
        <div class="feature-item">
          <img :src="more" class="feature-icon" />
          <div class="feature-text">更多</div>
        </div>
      </div>
    </div>


    <div class="package-list">
      <el-tabs v-model="activeTab" @tab-change="onTabChange">
        <el-tab-pane label="到站包裹" name="received">
          <div class="list-toolbar" v-if="packages.length > 0 || keyword || statusFilter !== 'all'">
            <el-radio-group v-model="statusFilter" size="small">
              <el-radio-button value="all">全部 ({{ packages.length }})</el-radio-button>
              <el-radio-button value="pending">未取件 ({{ pendingCount }})</el-radio-button>
              <el-radio-button value="done">已取件 ({{ packages.length - pendingCount }})</el-radio-button>
            </el-radio-group>
          </div>

          <el-row :gutter="20">
            <el-col :span="24" v-for="pkg in filteredPackages" :key="pkg.id">
              <div><span class="station">菜鸟驿站</span>{{ pkg.station }}</div>
              <el-card class="package-card" shadow="hover">
                <div class="package-card-content">
                  <div class="pickup-info">
                    <img :src="courierIcon(pkg.courier)" class="feature-icon" />
                    <div class="pickup-code"> {{ pkg.pickupCode }}</div>
                  </div>
                  <div class="package-courier"> {{ pkg.courier }}</div>
                  <div class="package-id"> 单号 {{ pkg.id }}</div>
                  <div class="package-status">
                    <span class="status-label">状态: <span :class="pkg.pickedUp ? 'picked-up' : 'not-picked-up'">{{ pkg.pickedUp ? '已取件' : '未取件' }}</span></span>
                    <span class="status-actions">
                      <el-button @click="sfm" class="pikupbtn" type="primary" round>出库码出库</el-button>
                      <el-button :disabled="pkg.pickedUp" @click="pikup(pkg)" class="pikupbtn" type="primary" round>确认取件</el-button>
                    </span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-empty v-if="filteredPackages.length === 0" description="暂无符合条件的快递" />
        </el-tab-pane>

        <el-tab-pane label="我寄出的" name="sent">
          <el-row :gutter="20">
            <el-col :span="24" v-for="pkg in sentPackages" :key="pkg.id">
              <el-card class="package-card" shadow="hover">
                <div class="package-card-content">
                  <div class="pickup-info">
                    <img :src="courierIcon(pkg.courier)" class="feature-icon" />
                    <div class="package-courier sent-courier">{{ pkg.courier }}</div>
                  </div>
                  <div class="package-id"> 单号 {{ pkg.id }}</div>
                  <div class="sent-meta">
                    收件人：{{ pkg.receiver }} · 驿站：{{ pkg.station }} · {{ formatTime(pkg.createdAt) }}
                  </div>
                  <div class="package-status">
                    <span class="status-label">状态: <span :class="pkg.pickedUp ? 'picked-up' : 'not-picked-up'">{{ pkg.pickedUp ? '对方已取件' : '待取件' }}</span></span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-empty v-if="sentPackages.length === 0 && !sentLoading" description="还没有寄出过包裹" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 消息中心抽屉 -->
    <el-drawer v-model="notifyDrawer" title="消息中心" size="360px">
      <div class="notify-toolbar">
        <span class="notify-count">未读 {{ unreadCount }} 条</span>
        <el-button size="small" :disabled="unreadCount === 0" @click="markAllRead">全部已读</el-button>
      </div>
      <div v-if="notifications.length === 0" class="notify-empty">暂无消息</div>
      <div
        v-for="n in notifications"
        :key="n.id"
        class="notify-item"
        :class="{ unread: !n.isRead }"
      >
        <div class="notify-title">
          <span class="notify-dot" v-if="!n.isRead"></span>{{ n.title }}
          <span class="notify-time">{{ formatTime(n.createdAt) }}</span>
        </div>
        <div class="notify-content">{{ n.content }}</div>
      </div>
    </el-drawer>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="pwdDialog" title="修改密码" width="400px">
      <el-form :model="pwdForm" label-width="80px" @submit.prevent>
        <el-form-item label="原密码">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="至少 6 位" />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="pwdForm.confirm" type="password" show-password @keyup.enter="submitPassword" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdDialog = false">取消</el-button>
        <el-button type="primary" :loading="pwdSubmitting" @click="submitPassword">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { Search, User, Bell, ArrowDown } from '@element-plus/icons-vue';
import receiveIcon from '../assets/icons/receive.png';
import sendIcon from '../assets/icons/send.png';
import swapIcon from '../assets/icons/swap.png';
import outcodeIcon from '../assets/icons/outcode.png';
import points from '../assets/icons/points.png';
import global from '../assets/icons/global.png';
import more from '../assets/icons/more.png';
import recycle from '../assets/icons/recycle.png';
import save from '../assets/icons/save.png';
import jdl from '../assets/icons/jdl.png';
import sf from '../assets/icons/sf.png';
import ztoIcon from '../assets/icons/zto.png';
import ytoIcon from '../assets/icons/yto.png';
import stoIcon from '../assets/icons/sto.png';
import ydIcon from '../assets/icons/yd.png';
import emsIcon from '../assets/icons/ems.png';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

// 按快递公司匹配图标，未知公司用中性包裹图标兜底
const courierIcon = (courier) => {
  const c = String(courier || '');
  if (c.includes('顺丰')) return sf;
  if (c.includes('京东')) return jdl;
  if (c.includes('中通')) return ztoIcon;
  if (c.includes('圆通')) return ytoIcon;
  if (c.includes('申通')) return stoIcon;
  if (c.includes('韵达')) return ydIcon;
  if (c.includes('邮政') || c.includes('EMS')) return emsIcon;
  return receiveIcon;
};
const token = ref(null);
const packages = ref([]);
const sentPackages = ref([]);
const sentLoading = ref(false);
const activeTab = ref('received');
const statusFilter = ref('all');
const keyword = ref('');

const notifications = ref([]);
const unreadCount = ref(0);
const notifyDrawer = ref(false);

const pwdDialog = ref(false);
const pwdSubmitting = ref(false);
const pwdForm = ref({ oldPassword: '', newPassword: '', confirm: '' });

// 到站包裹：按状态 + 关键词过滤（单号/快递公司/驿站）
const pendingCount = computed(() => packages.value.filter((p) => !p.pickedUp).length);
const filteredPackages = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  return packages.value.filter((p) => {
    if (statusFilter.value === 'pending' && p.pickedUp) return false;
    if (statusFilter.value === 'done' && !p.pickedUp) return false;
    if (!kw) return true;
    return [p.id, p.courier, p.station].some((v) => String(v).toLowerCase().includes(kw));
  });
});

// 获取包裹信息的方法（身份由 token 决定，不再传 username）
const fetchPackages = async () => {
  if (!ensureToken()) return;
  try {
    const response = await axios.get('/api/packages');
    packages.value = response.data;
  } catch (error) {
    console.error('Fetch packages error:', error);
  }
};

// 我寄出的包裹：切到该标签页时按需加载
const fetchSent = async () => {
  if (!ensureToken()) return;
  sentLoading.value = true;
  try {
    const response = await axios.get('/api/packages/sent');
    sentPackages.value = response.data;
  } catch (error) {
    console.error('Fetch sent packages error:', error);
  } finally {
    sentLoading.value = false;
  }
};

const onTabChange = (name) => {
  if (name === 'sent' && sentPackages.value.length === 0) fetchSent();
};

const fetchNotifications = async () => {
  if (!ensureToken()) return;
  try {
    const { data } = await axios.get('/api/notifications');
    notifications.value = data.list || [];
    unreadCount.value = data.unreadCount || 0;
  } catch (error) {
    console.error('Fetch notifications error:', error);
  }
};

const openNotifications = () => {
  notifyDrawer.value = true;
  fetchNotifications();
};

const markAllRead = async () => {
  try {
    await axios.post('/api/notifications/read-all');
    await fetchNotifications();
  } catch (error) {
    ElMessage.error('操作失败，请稍后重试');
  }
};

const onUserCommand = (command) => {
  if (command === 'password') {
    pwdForm.value = { oldPassword: '', newPassword: '', confirm: '' };
    pwdDialog.value = true;
  } else if (command === 'logout') {
    userStore.logout();
    ElMessage.success('已退出登录');
    router.push('/');
  }
};

const submitPassword = async () => {
  const { oldPassword, newPassword, confirm } = pwdForm.value;
  if (!oldPassword || !newPassword) {
    ElMessage.warning('请填写完整');
    return;
  }
  if (newPassword.length < 6) {
    ElMessage.warning('新密码长度至少 6 位');
    return;
  }
  if (newPassword !== confirm) {
    ElMessage.warning('两次输入的新密码不一致');
    return;
  }
  pwdSubmitting.value = true;
  try {
    const { data } = await axios.post('/api/change-password', { oldPassword, newPassword });
    if (data.type === 'success') {
      ElMessage.success('密码修改成功，下次登录请使用新密码');
      pwdDialog.value = false;
    } else {
      ElMessage.error(data.message || '修改失败');
    }
  } catch (error) {
    ElMessage.error('修改失败，请稍后重试');
  } finally {
    pwdSubmitting.value = false;
  }
};

function ensureToken() {
  if (!token.value) token.value = userStore.token;
  if (!token.value) {
    ElMessage.warning('请先登录');
    router.push('/');
    return false;
  }
  return true;
}

const formatTime = (t) => {
  if (!t) return '';
  return String(t).replace('T', ' ').slice(0, 16);
};

// 进入页面时加载一次包裹与未读数
onMounted(() => {
  token.value = userStore.token;
  if (!token.value) {
    ElMessage.warning('请先登录');
    router.push('/');
    return;
  }

  // 只在进入页面时加载一次，不做定时轮询，避免列表反复重渲染闪烁
  fetchPackages();
  fetchNotifications();
});

async function pikup(pkg) {
  if (!ensureToken()) return;
  try {
    const response = await axios.post(
      '/api/pickup',
      { id: pkg.id, pickupCode: pkg.pickupCode },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token.value}` } }
    );

    const result = response.data;
    if (result.type === 'success') {
      ElMessage.success(result.message || '取件成功');
      pkg.pickedUp = true;
      fetchNotifications();
    } else {
      ElMessage.error(result.message || '取件失败，请检查信息');
    }
  } catch (error) {
    console.error('Pickup error:', error);
    ElMessage.error('取件失败，请稍后重试');
  }
}

const gotoglobal = () => {
  router.push('/global');
};

const sfm = () => {
  router.push('/sfm');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap');
.station {
  font-family: sans-serif;
  color: rgb(1, 72, 254);
  font-weight: bold;
  margin-right: 15px;
}
.pickup-info {
  display: flex;
  align-items: center; /* Vertically center icon and text */
}
.home-page {
  background-color: #f5f5f5;
}

.top-banner {
  background: #1673ff;
  padding: 14px 16px 60px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  position: relative;
}

.user-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  margin-bottom: 14px;
}

.greeting {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 600;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.bell {
  cursor: pointer;
  color: #fff;
}

.user-menu {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.search-bar {
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
}

.white-card {
  background: white;
  margin-top: -40px;
  border-radius: 16px;
  padding: 5px 4px 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 1;
  margin-left: 4px;
  margin-right: 4px;
}

.main-functions {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 15px;
}

.func-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.func-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 6px;
}

.func-text {
  font-size: 14px;
  color: #fff;
}

.feature-scroll-bar {
  display: flex;
  overflow-x: auto;
  margin-bottom: 16px;
  justify-content: space-around;
}

.feature-item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
}

.feature-icon {
  width: 36px;
  height: 36px;
}

.feature-text {
  font-size: 12px;
}

.package-list {
  margin: 20px;
}

.list-toolbar {
  margin-bottom: 12px;
}

.package-card {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
}

.package-id {
  font-size: 16px;
  font-weight: bold;
}

.package-status {
  margin-top: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 8px;
}

.status-actions {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
}

.picked-up {
  color: green;
}

.not-picked-up {
  color: red;
}

.pickup-code {
  font-size: 20px;
  font-family: "Cal Sans";
  font-weight: 400;
  font-style: normal;
  margin-left: 15px;
  display: inline-block;
}

.no-underline {
  text-decoration: none;
}

.pikupbtn {
  margin-left: 0;
}

.sent-courier {
  font-size: 17px;
  font-weight: 700;
  margin-left: 10px;
}

.sent-meta {
  margin-top: 6px;
  font-size: 13px;
  color: #888;
}

/* 消息中心 */
.notify-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.notify-count {
  font-size: 13px;
  color: #888;
}

.notify-empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.notify-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 4px;
}

.notify-item.unread .notify-title {
  font-weight: 700;
}

.notify-title {
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.notify-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f56c6c;
  flex-shrink: 0;
}

.notify-time {
  margin-left: auto;
  font-size: 12px;
  color: #aaa;
  font-weight: 400;
}

.notify-content {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
  line-height: 1.5;
}
</style>
