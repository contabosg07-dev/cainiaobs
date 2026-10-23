<template>
  <div class="page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>驿站管理</span>
          <el-button type="primary" size="small" :icon="Plus" @click="openAdd">新增驿站</el-button>
        </div>
      </template>
      <el-table :data="stations" border stripe style="width: 100%">
        <el-table-column type="index" label="#" width="60" align="center" />
        <el-table-column prop="name" label="驿站名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="packageCount" label="包裹数" width="140" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.packageCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="openRename(row)">改名</el-button>
            <el-button
              type="danger"
              size="small"
              :disabled="row.packageCount > 0"
              @click="removeStation(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="420px">
      <el-form :model="form" label-width="80px" @submit.prevent>
        <el-form-item label="名称">
          <el-input
            v-model="form.name"
            placeholder="请输入驿站名称"
            @keyup.enter="submit"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import axios from 'axios'
import { useWebSocket } from '@/composables/useWebSocket'

const stations = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const mode = ref('add')
const editingName = ref('')
const form = reactive({ name: '' })

// 轮询刷新时静默执行：不闪 loading、数据没变不重绘表格
let lastJson = ''
const fetchStations = async (silent = false) => {
  try {
    const { data } = await axios.get('/api/admin/stations')
    const json = JSON.stringify(data)
    if (json !== lastJson) {
      lastJson = json
      stations.value = data
    }
  } catch (e) {
    if (!silent) ElMessage.error('获取驿站失败')
  }
}

const openAdd = () => {
  mode.value = 'add'
  dialogTitle.value = '新增驿站'
  form.name = ''
  dialogVisible.value = true
}

const openRename = (row) => {
  mode.value = 'rename'
  dialogTitle.value = '修改驿站名称'
  editingName.value = row.name
  form.name = row.name
  dialogVisible.value = true
}

const submit = async () => {
  const name = form.name.trim()
  if (!name) {
    ElMessage.warning('名称不能为空')
    return
  }
  submitting.value = true
  try {
    let data
    if (mode.value === 'add') {
      ;({ data } = await axios.post('/api/admin/station', { name }))
    } else {
      ;({ data } = await axios.put(`/api/admin/station/${encodeURIComponent(editingName.value)}`, { name }))
    }
    if (data.type === 'success') {
      ElMessage.success(data.message || '操作成功')
      dialogVisible.value = false
      fetchStations()
    } else {
      ElMessage.error(data.message || '操作失败')
    }
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    submitting.value = false
  }
}

const removeStation = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除驿站 "${row.name}" 吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  try {
    const { data } = await axios.delete(`/api/admin/station/${encodeURIComponent(row.name)}`)
    if (data.type === 'success') {
      ElMessage.success(data.message || '删除成功')
      fetchStations()
    } else {
      ElMessage.error(data.message || '删除失败')
    }
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

useWebSocket(() => fetchStations(true))

onMounted(fetchStations)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
