<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-row">
      <el-col v-for="card in cards" :key="card.label" :xs="12" :sm="8" :md="6">
        <el-card shadow="hover" class="stat-card" body-style="display:flex;align-items:center;gap:16px">
          <div class="stat-icon" :style="{ background: card.color }">
            <el-icon :size="28"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="12">
        <el-card shadow="never">
          <template #header>各快递公司占比</template>
          <div ref="pieRef" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="never">
          <template #header>各驿站包裹数</template>
          <div ref="barRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>近 7 天每日新增快递</template>
          <div ref="lineRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Box, CircleCheck, Clock, Money } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { useWebSocket } from '@/composables/useWebSocket'

const stats = reactive({
  totalUsers: 0,
  totalPackages: 0,
  pickedUp: 0,
  notPickedUp: 0,
  income: 0,
  courierStats: [],
  stationStats: [],
  dailyStats: [],
})

const cards = ref([])
const pieRef = ref(null)
const barRef = ref(null)
const lineRef = ref(null)
let pieChart, barChart, lineChart

// 轮询刷新时静默执行：数据没变不重绘图表，避免闪烁
let lastStatsJson = ''
const fetchStats = async (silent = false) => {
  try {
    const { data } = await axios.get('/api/admin/stats')
    const json = JSON.stringify(data)
    if (json === lastStatsJson) return
    lastStatsJson = json
    Object.assign(stats, data)
    cards.value = [
      { label: '总用户数', value: stats.totalUsers, color: '#409eff', icon: User },
      { label: '总快递数', value: stats.totalPackages, color: '#67c23a', icon: Box },
      { label: '已出库', value: stats.pickedUp, color: '#13ce66', icon: CircleCheck },
      { label: '未出库', value: stats.notPickedUp, color: '#e6a23c', icon: Clock },
      { label: '收入(元)', value: stats.income, color: '#f56c6c', icon: Money },
    ]
    await nextTick()
    renderCharts()
  } catch (e) {
    if (!silent) ElMessage.error('获取统计数据失败')
  }
}

const renderCharts = () => {
  // 饼图：各快递公司占比
  if (pieRef.value) {
    pieChart = pieChart || echarts.init(pieRef.value)
    pieChart.setOption({
      tooltip: { trigger: 'item' },
      legend: { bottom: 0, type: 'scroll' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: stats.courierStats,
        label: { formatter: '{b}: {c} ({d}%)' },
      }],
    })
  }

  // 柱状图：各驿站包裹数
  if (barRef.value) {
    barChart = barChart || echarts.init(barRef.value)
    const names = stats.stationStats.map((i) => i.name)
    const values = stats.stationStats.map((i) => i.value)
    barChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 20, bottom: 40 },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { interval: 0, rotate: names.length > 4 ? 30 : 0 },
      },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{
        type: 'bar',
        data: values,
        itemStyle: { color: '#409eff' },
        barMaxWidth: 40,
      }],
    })
  }

  // 折线图：近 7 天每日新增
  if (lineRef.value) {
    lineChart = lineChart || echarts.init(lineRef.value)
    const dates = stats.dailyStats.map((i) => i.date)
    const counts = stats.dailyStats.map((i) => i.count)
    lineChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 40, right: 20, top: 20, bottom: 30 },
      xAxis: { type: 'category', data: dates, boundaryGap: false },
      yAxis: { type: 'value', minInterval: 1 },
      series: [{
        type: 'line',
        data: counts,
        smooth: true,
        areaStyle: {},
        itemStyle: { color: '#67c23a' },
      }],
    })
  }
}

const onResize = () => {
  pieChart?.resize()
  barChart?.resize()
  lineChart?.resize()
}

useWebSocket(() => fetchStats(true))

onMounted(() => {
  fetchStats()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  pieChart?.dispose()
  barChart?.dispose()
  lineChart?.dispose()
})
</script>

<style scoped>
.stat-row {
  margin-bottom: 20px;
}
.stat-card {
  margin-bottom: 20px;
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
.chart-row {
  margin-bottom: 20px;
}
.chart-box {
  height: 300px;
}
</style>
