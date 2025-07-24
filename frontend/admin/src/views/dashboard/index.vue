<template>
  <div class="dashboard-container">
    <!-- 今日概况 -->
    <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
      <n-grid-item>
        <n-card hoverable>
          <n-statistic label="今日新增用户" :value="summary.todayUserCount" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card hoverable>
          <n-statistic label="今日新增喂养员" :value="summary.todayFeederCount" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card hoverable>
          <n-statistic label="今日订单数" :value="summary.todayOrderCount" />
        </n-card>
      </n-grid-item>
      <n-grid-item v-if="canViewAmount">
        <n-card hoverable>
          <n-statistic label="今日订单金额" :value="summary.todayAmount" prefix="¥" />
        </n-card>
      </n-grid-item>
      <n-grid-item v-else>
        <n-card hoverable>
          <n-statistic label="今日订单金额" value="***" />
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 累计数据 -->
    <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
      <n-grid-item>
        <n-card hoverable>
          <n-statistic label="总用户数" :value="summary.totalUserCount" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card hoverable>
          <n-statistic label="总喂养员数" :value="summary.totalFeederCount" />
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card hoverable>
          <n-statistic label="总订单数" :value="summary.totalOrderCount" />
        </n-card>
      </n-grid-item>
      <n-grid-item v-if="canViewAmount">
        <n-card hoverable>
          <n-statistic label="总订单金额" :value="summary.totalAmount" prefix="¥" />
        </n-card>
      </n-grid-item>
      <n-grid-item v-else>
        <n-card hoverable>
          <n-statistic label="总订单金额" value="***" />
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-grid :cols="2" :x-gap="16" :y-gap="16">
      <!-- 趋势折线图 -->
      <n-grid-item>
        <n-card title="订单趋势" class="h-full">
          <div ref="chartRef" class="chart-container"></div>
        </n-card>
      </n-grid-item>

      <!-- 订单状态统计 -->
      <n-grid-item>
        <n-card title="订单状态统计">
          <n-grid :cols="2" :x-gap="12" :y-gap="12">
            <n-grid-item>
              <n-statistic label="待完成" :value="orderStats.pending" />
            </n-grid-item>
            <n-grid-item>
              <n-statistic label="已完成" :value="orderStats.completed" />
            </n-grid-item>
            <n-grid-item>
              <n-statistic label="退款订单" :value="orderStats.refund" />
            </n-grid-item>
            <n-grid-item>
              <n-statistic label="可投诉订单" :value="orderStats.complaint" />
            </n-grid-item>
          </n-grid>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 快捷操作 -->
    <n-card title="快捷操作" class="mt-4">
      <n-space>
        <n-button type="primary" @click="$router.push('/orders')">
          <template #icon>
            <n-icon><List /></n-icon>
          </template>
          查看订单
        </n-button>
        <n-button type="info" @click="$router.push('/complaints')">
          <template #icon>
            <n-icon><Warning /></n-icon>
          </template>
          投诉管理
        </n-button>
        <n-button type="success" @click="$router.push('/feeders')">
          <template #icon>
            <n-icon><People /></n-icon>
          </template>
          喂养员管理
        </n-button>
        <n-button type="warning" @click="$router.push('/feedback')">
          <template #icon>
            <n-icon><ChatboxEllipses /></n-icon>
          </template>
          反馈中心
        </n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { NCard, NGrid, NGridItem, NStatistic, NSpace, NButton, NIcon } from 'naive-ui'
import { List, Warning, People, ChatboxEllipses } from '@vicons/ionicons5'
import { getDashboardSummary, getDashboardChart } from '@/api/dashboard'
import { usePermission } from '@/composables/usePermission'

// 数据定义
interface DashboardSummary {
  todayUserCount: number
  todayFeederCount: number
  todayOrderCount: number
  todayAmount: number
  totalUserCount: number
  totalFeederCount: number
  totalOrderCount: number
  totalAmount: number
  orderStats: {
    pending: number
    completed: number
    refund: number
    complaint: number
  }
}

interface ChartData {
  dates: string[]
  orderCounts: number[]
  orderAmounts?: number[]
}

// 响应式数据
const summary = ref<DashboardSummary>({
  todayUserCount: 0,
  todayFeederCount: 0,
  todayOrderCount: 0,
  todayAmount: 0,
  totalUserCount: 0,
  totalFeederCount: 0,
  totalOrderCount: 0,
  totalAmount: 0,
  orderStats: {
    pending: 0,
    completed: 0,
    refund: 0,
    complaint: 0
  }
})

const chartData = ref<ChartData>({
  dates: [],
  orderCounts: [],
  orderAmounts: []
})

const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 权限控制
const { hasPermission } = usePermission()
const canViewAmount = hasPermission('dashboard:view_amount')

// API调用
const fetchSummary = async () => {
  try {
    const response = await getDashboardSummary()
    summary.value = response
  } catch (error) {
    console.error('获取概况数据失败:', error)
  }
}

const fetchChartData = async () => {
  try {
    const response = await getDashboardChart(7)
    chartData.value = response
    initChart()
  } catch (error) {
    console.error('获取图表数据失败:', error)
  }
}

// 图表初始化
const initChart = () => {
  if (!chartRef.value) return
  
  chartInstance = echarts.init(chartRef.value)
  
  const series = [
    {
      name: '订单数量',
      type: 'line',
      data: chartData.value.orderCounts,
      smooth: true,
      lineStyle: { color: '#5470c6' },
      itemStyle: { color: '#5470c6' }
    }
  ]

  if (canViewAmount && chartData.value.orderAmounts) {
    series.push({
      name: '订单金额',
      type: 'line',
      data: chartData.value.orderAmounts,
      smooth: true,
      lineStyle: { color: '#91cc75' },
      itemStyle: { color: '#91cc75' }
    })
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = params[0].axisValue + '<br/>'
        params.forEach((item: any) => {
          if (item.seriesName === '订单金额') {
            result += `${item.marker} ${item.seriesName}: ¥${item.value}<br/>`
          } else {
            result += `${item.marker} ${item.seriesName}: ${item.value}<br/>`
          }
        })
        return result
      }
    },
    legend: {
      data: series.map(s => s.name)
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.value.dates
    },
    yAxis: [
      {
        type: 'value',
        name: '订单数量',
        position: 'left'
      },
      ...(canViewAmount && chartData.value.orderAmounts ? [{
        type: 'value',
        name: '订单金额',
        position: 'right',
        axisLabel: {
          formatter: '¥{value}'
        }
      }] : [])
    ],
    series
  }

  chartInstance.setOption(option)
}

// 响应式处理
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 计算属性
const orderStats = computed(() => summary.value.orderStats)

// 生命周期
onMounted(async () => {
  await fetchSummary()
  await fetchChartData()
  
  nextTick(() => {
    initChart()
  })
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}

.h-full {
  height: 100%;
}
</style>