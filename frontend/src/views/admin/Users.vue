<template>
  <div class="page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button :icon="Refresh" size="small" @click="fetchUsers">刷新</el-button>
        </div>
      </template>
      <el-table :data="users" border stripe style="width: 100%">
        <el-table-column type="index" label="#" width="60" align="center" />
        <el-table-column prop="username" label="用户名" min-width="140" show-overflow-tooltip />
        <el-table-column prop="role" label="角色" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : ''" effect="plain">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="identityCode" label="身份码" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" width="120" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              type="danger"
              size="small"
              :disabled="row.role === 'admin'"
              @click="removeUser(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import axios from 'axios'
import { useWebSocket } from '@/composables/useWebSocket'

const users = ref([])

// 轮询刷新时静默执行：不闪 loading、数据没变不重绘表格
let lastJson = ''
const fetchUsers = async (silent = false) => {
  try {
    const { data } = await axios.get('/api/admin/users')
    const json = JSON.stringify(data)
    if (json !== lastJson) {
      lastJson = json
      users.value = data
    }
  } catch (e) {
    if (!silent) ElMessage.error('获取用户失败')
  }
}

const removeUser = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除用户 "${row.username}" 吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  try {
    const { data } = await axios.delete(`/api/admin/user/${encodeURIComponent(row.username)}`)
    if (data.type === 'success') {
      ElMessage.success(data.message || '删除成功')
      fetchUsers()
    } else {
      ElMessage.error(data.message || '删除失败')
    }
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

useWebSocket(() => fetchUsers(true))

onMounted(fetchUsers)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
