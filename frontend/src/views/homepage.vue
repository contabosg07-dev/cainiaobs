<template>
  <div class="home-page">
    
    <div class="top-banner">
      
      <el-input
        class="search-bar"
        placeholder="复制单号查全网包裹"
        prefix-icon="el-icon-search"
        size="large"
        clearable
      >
        <template #suffix>
          <el-icon><i class="el-icon-camera"></i></el-icon>
        </template>
      </el-input>
      <div class="main-functions">
        <div class="func-item" @click="fetchPackages">
          <img :src="receiveIcon" class="func-icon" />
          <div class="func-text">取包裹</div>
        </div>
        <router-link to="/send" class="no-underline"><div class="func-item">
          <img :src="sendIcon" class="func-icon" />
          <div class="func-text">寄包裹</div>
        </div></router-link>
        <div class="func-item">
          <img :src="swapIcon" class="func-icon" />
          <div class="func-text">物换物</div>
        </div>
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
          <div class="feature-text">
            菜鸟回收
            
          </div>
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


    <div v-if="packages.length > 0" class="package-list">
      <h3>到站包裹</h3>
     
      <el-row :gutter="20">
        <el-col :span="24" v-for="pkg in packages" :key="pkg.id">
         <div><span class="station">菜鸟驿站</span>{{ pkg.station }}</div> 
          <el-card class="package-card" shadow="hover">
            <div class="package-card-content">
              <div class="pickup-info">
             <img :src="pkg.courier === '顺丰快递' ? sf : jdl" class="feature-icon" />
              <div class="pickup-code"> {{ pkg.pickupCode }}</div></div>
              <div class="package-courier"> {{ pkg.courier }}</div>
              <div class="package-id"> 单号 {{ pkg.id }}</div>
              <div class="package-status">
                状态: <span :class="pkg.pickedUp ? 'picked-up' : 'not-picked-up'">{{ pkg.pickedUp ? '已取件' : '未取件' }}</span>
                <el-button @click="sfm"class="pikupbtn" type="primary" round >出库码出库</el-button>
                <el-button @click="pikup(pkg)"class="pikupbtn" type="primary" round >找人代取</el-button>
              </div>
             
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-empty v-if="packages.length === 0" description="暂无快递" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/user'; 
import receiveIcon from '../assets/icons/receive.png';
import sendIcon from '../assets/icons/send.png';
import swapIcon from '../assets/icons/swap.png';
import outcodeIcon from '../assets/icons/outcode.png';
import points from '../assets/icons/points.png';
import global from '../assets/icons/global.png';
import more from '../assets/icons/more.png';
import recycle from '../assets/icons/recycle.png';
import save from '../assets/icons/save.png';
import jdl  from '../assets/icons/jdl.png';
import sf from '../assets/icons/sf.png';
import { ElMessage } from 'element-plus';
const userStore = useUserStore();
import axios from 'axios';
const token = ref(null);
const packages = ref([]);

// 获取包裹信息的方法
const fetchPackages = async () => {
  if (!token.value) {
    // 如果当前没有 token，从 Pinia 中获取 token
    token.value = userStore.token;
    if (!token.value) {
      alert('请先登录');
      return;
    }
  }

  try {
    const response = await axios.get(`/api/packages`, {
      headers: { Authorization: `Bearer ${token.value}` },
      params: { username: userStore.username },
    });
    packages.value = response.data;
  } catch (error) {
    console.error('Fetch packages error:', error);
    alert('获取快递信息失败');
  }
};

// 定时轮询刷新包裹（迁移 Cloudflare Workers 后替代原 WebSocket 广播）
let pollTimer = null

onMounted(() => {

token.value = userStore.token;
if (!token.value) {
  alert('请先登录');
  return;
}

fetchPackages();

pollTimer = setInterval(() => {
  if (token.value) {
    fetchPackages();
  }
}, 5000);

});

onBeforeUnmount(() => {
  clearInterval(pollTimer);
});



async function pikup(pkg) {
if (!token.value) {
  alert('请先登录');
  return;
}

try {
    const response = await axios.post(
      `/api/pickup`,
      {
        username: userStore.username,
        id: pkg.id,
        pickupCode: pkg.pickupCode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    const result = response.data;
    if (result.type === 'success') {
     
      ElMessage.success(result.message || '取件成功');
      
      pkg.pickedUp = true;
    } else {
      ElMessage.error(result.message || '取件失败，请检查信息');
    }
  } catch (error) {
    console.error('Pickup error:', error);
    ElMessage.error('取件失败，请稍后重试');
  }
};
import { useRouter } from 'vue-router'
  
  const router = useRouter()
const gotoglobal = () => {
  router.push('/global') 

}
const sfm = () => {
  router.push('/sfm') 

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cal+Sans&display=swap');
.station {
font-family:  sans-serif;
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
  padding: 20px 16px 60px;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  position: relative;
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

.package-card {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.package-id {
  font-size: 16px;
  font-weight: bold;
}

.package-status {
  margin-top: 8px;
  font-size: 14px;
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
  display: inline-block
}
.no-underline {
text-decoration: none; 
}
.pikupbtn{
float: right;
margin-left: 10px;
}
</style>

