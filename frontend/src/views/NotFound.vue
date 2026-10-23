<template>
  <div class="notfound">
    <div class="code">404</div>
    <p>页面不存在或已被移除</p>
    <el-button type="primary" round @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push(localStorage.getItem('token') ? '/home' : '/')
}
</script>

<style scoped>
.notfound {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #f5f6fa;
}
.code {
  font-size: 88px;
  font-weight: 800;
  color: #1673ff;
  line-height: 1;
}
p {
  color: #666;
  margin: 0 0 16px;
}
</style>
