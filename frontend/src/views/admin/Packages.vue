<template>
  <div class="page">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>快递管理</span>
          <div class="header-btns">
            <el-button type="primary" size="small" :icon="Plus" @click="openAdd">快递入库</el-button>
            <el-button size="small" :icon="Download" @click="exportCsv">导出 CSV</el-button>
            <el-button size="small" :icon="Refresh" @click="fetchPackages">刷新</el-button>
          </div>
        </div>
      </template>
      <el-table :data="packages" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="id" label="快递ID" width="190" show-overflow-tooltip />
        <el-table-column prop="courier" label="快递公司" width="110" />
        <el-table-column prop="pickupCode" label="取件码" width="110" />
        <el-table-column prop="sender" label="寄件人" width="110" />
        <el-table-column prop="receiver" label="收件人" width="110" />
        <el-table-column prop="station" label="站点" width="120" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.pickedUp ? 'success' : 'info'">
              {{ row.pickedUp ? '已出库' : '未出库' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatTime(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="toggleStatus(row)">
              {{ row.pickedUp ? '标记未出库' : '标记已出库' }}
            </el-button>
            <el-button type="danger" size="small" @click="removePackage(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="addDialog" title="快递入库" width="480px">
      <el-form :model="addForm" label-width="80px" @submit.prevent>
        <el-form-item label="快递单号" required>
          <el-input v-model="addForm.id" placeholder="请输入快递单号" />
        </el-form-item>
        <el-form-item label="取件码" required>
          <el-input v-model="addForm.pickupCode" placeholder="如 1-2-3004" />
        </el-form-item>
        <el-form-item label="快递公司" required>
          <el-select v-model="addForm.courier" placeholder="选择快递公司" style="width: 100%">
            <el-option v-for="c in couriers" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="收件人" required>
          <el-input v-model="addForm.receiver" placeholder="收件人用户名" />
        </el-form-item>
        <el-form-item label="驿站" required>
          <el-select v-model="addForm.station" placeholder="选择驿站" style="width: 100%">
            <el-option v-for="s in stations" :key="s.name" :label="s.name" :value="s.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialog = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitAdd">入库</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Plus, Download } from '@element-plus/icons-vue'
import axios from 'axios'
import { useWebSocket } from '@/composables/useWebSocket'

const packages = ref([])
const loading = ref(false)

const addDialog = ref(false)
const submitting = ref(false)
const stations = ref([])
const couriers = ['顺丰快递', '京东物流', '中通快递', '圆通快递', '申通快递', '韵达快递', '邮政快递']
const addForm = reactive({ id: '', pickupCode: '', courier: '', receiver: '', station: '' })

const fetchPackages = async () => {
  loading.value = true
  try {
    const { data } = await axios.get('/api/admin/packages')
    packages.value = data
  } catch (e) {
    ElMessage.error('获取快递失败')
  } finally {
    loading.value = false
  }
}

const fetchStations = async () => {
  try {
    const { data } = await axios.get('/api/admin/stations')
    stations.value = data
  } catch (e) {
    /* 下拉列表加载失败不阻塞页面 */
  }
}

const openAdd = () => {
  Object.assign(addForm, { id: '', pickupCode: '', courier: '', receiver: '', station: '' })
  if (stations.value.length === 0) fetchStations()
  addDialog.value = true
}

const submitAdd = async () => {
  for (const key of ['id', 'pickupCode', 'courier', 'receiver', 'station']) {
    if (!String(addForm[key]).trim()) {
      ElMessage.warning('请填写完整后再入库')
      return
    }
  }
  submitting.value = true
  try {
    const { data } = await axios.post('/api/sendadmin', { ...addForm })
    if (data.type === 'success') {
      ElMessage.success(data.message || '入库成功，已通知收件人')
      addDialog.value = false
      fetchPackages()
    } else {
      ElMessage.error(data.message || '入库失败')
    }
  } catch (e) {
    ElMessage.error('入库失败')
  } finally {
    submitting.value = false
  }
}

// 导出当前快递列表为 CSV（带 BOM，Excel 打开中文不乱码）
const exportCsv = () => {
  if (packages.value.length === 0) {
    ElMessage.warning('当前没有可导出的数据')
    return
  }
  const header = ['快递ID', '快递公司', '取件码', '寄件人', '收件人', '站点', '状态', '创建时间']
  const rows = packages.value.map((p) => [
    p.id, p.courier, p.pickupCode, p.sender, p.receiver, p.station,
    p.pickedUp ? '已出库' : '未出库', formatTime(p.createdAt),
  ])
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [header, ...rows].map((r) => r.map(esc).join(',')).join('\r\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `快递列表_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const toggleStatus = async (row) => {
  try {
    const { data } = await axios.patch(`/api/admin/package/${encodeURIComponent(row.id)}/status`, {
      isPickedUp: !row.pickedUp,
    })
    if (data.type === 'success') {
      ElMessage.success(data.message || '更新成功')
      fetchPackages()
    } else {
      ElMessage.error(data.message || '更新失败')
    }
  } catch (e) {
    ElMessage.error('更新失败')
  }
}

const removePackage = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除快递 "${row.id}" 吗？`, '提示', { type: 'warning' })
  } catch {
    return
  }
  try {
    const { data } = await axios.delete(`/api/admin/package/${encodeURIComponent(row.id)}`)
    if (data.type === 'success') {
      ElMessage.success(data.message || '删除成功')
      fetchPackages()
    } else {
      ElMessage.error(data.message || '删除失败')
    }
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

const formatTime = (t) => {
  if (!t) return '-'
  if (Array.isArray(t)) {
    const [y, m, d, h = 0, mi = 0, s = 0] = t
    return `${y}-${pad(m)}-${pad(d)} ${pad(h)}:${pad(mi)}:${pad(s)}`
  }
  return String(t).replace('T', ' ').slice(0, 19)
}
const pad = (n) => String(n).padStart(2, '0')

useWebSocket(() => fetchPackages())

onMounted(() => {
  fetchPackages()
  fetchStations()
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-btns {
  display: inline-flex;
  align-items: center;
  gap: 0;
}
</style>
