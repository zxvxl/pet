<template>
  <div class="order-list-container">
    <n-card title="订单列表" :bordered="false">
      <!-- 统计信息 -->
      <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
        <n-grid-item>
          <n-card hoverable>
            <n-statistic label="今日订单" :value="stats.todayOrders" />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card hoverable>
            <n-statistic label="待处理" :value="stats.pendingOrders" />
          </n-card>
        </n-grid-item>
        <n-grid-item v-if="canViewAmount">
          <n-card hoverable>
            <n-statistic label="今日金额" :value="stats.todayAmount" prefix="¥" />
          </n-card>
        </n-grid-item>
        <n-grid-item v-else>
          <n-card hoverable>
            <n-statistic label="今日金额" value="***" />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card hoverable>
            <n-statistic label="完成率" :value="stats.completionRate" suffix="%" />
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <n-space>
          <n-input
            v-model:value="searchForm.keyword"
            placeholder="搜索订单号/用户/喂养员"
            style="width: 250px"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <n-icon><Search /></n-icon>
            </template>
          </n-input>
          <n-select
            v-model:value="searchForm.status"
            placeholder="订单状态"
            style="width: 150px"
            :options="statusOptions"
            clearable
          />
          <n-date-picker
            v-model:value="searchForm.dateRange"
            type="daterange"
            placeholder="下单日期范围"
            style="width: 250px"
            clearable
          />
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <n-icon><Search /></n-icon>
            </template>
            搜索
          </n-button>
          <n-button @click="handleReset">重置</n-button>
        </n-space>
      </div>

      <!-- 数据表格 -->
      <n-data-table
        :columns="tableColumns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />

      <!-- 操作按钮 -->
      <div class="action-bar">
        <n-space>
          <n-button type="primary" @click="handleRefresh">
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            刷新
          </n-button>
          <n-button type="success" @click="handleExport">
            <template #icon>
              <n-icon><Download /></n-icon>
            </template>
            导出
          </n-button>
        </n-space>
      </div>
    </n-card>

    <!-- 订单详情弹窗 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="订单详情" style="width: 800px">
      <div v-if="currentOrder">
        <n-tabs type="line" animated>
          <n-tab-pane name="basic" tab="基本信息">
            <n-descriptions :column="2" bordered>
              <n-descriptions-item label="订单号">{{ currentOrder.order_no }}</n-descriptions-item>
              <n-descriptions-item label="订单状态">
                <n-tag :type="getStatusType(currentOrder.status)">
                  {{ getStatusText(currentOrder.status) }}
                </n-tag>
              </n-descriptions-item>
              <n-descriptions-item label="用户">{{ currentOrder.user_name }}</n-descriptions-item>
              <n-descriptions-item label="喂养员">{{ currentOrder.feeder_name }}</n-descriptions-item>
              <n-descriptions-item label="下单时间">{{ formatDate(currentOrder.created_at) }}</n-descriptions-item>
              <n-descriptions-item label="服务时间">{{ formatDateTime(currentOrder.service_date, currentOrder.service_time) }}</n-descriptions-item>
              <n-descriptions-item label="服务地址" :span="2">{{ currentOrder.service_address }}</n-descriptions-item>
              <n-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '无' }}</n-descriptions-item>
            </n-descriptions>
          </n-tab-pane>
          
          <n-tab-pane name="service" tab="服务信息">
            <n-descriptions :column="2" bordered>
              <n-descriptions-item label="服务项目">{{ currentOrder.service_name }}</n-descriptions-item>
              <n-descriptions-item label="宠物信息">{{ currentOrder.pet_name }}</n-descriptions-item>
              <n-descriptions-item v-if="canViewAmount" label="订单金额">¥{{ currentOrder.amount }}</n-descriptions-item>
              <n-descriptions-item v-else label="订单金额">***</n-descriptions-item>
              <n-descriptions-item label="支付方式">{{ currentOrder.payment_method }}</n-descriptions-item>
              <n-descriptions-item label="支付时间">{{ formatDate(currentOrder.pay_time) }}</n-descriptions-item>
            </n-descriptions>
          </n-tab-pane>
          
          <n-tab-pane name="timeline" tab="订单进度">
            <n-timeline>
              <n-timeline-item
                v-for="(item, index) in currentOrder.timeline"
                :key="index"
                :type="item.type"
                :title="item.title"
                :time="formatDate(item.time)"
              >
                {{ item.description }}
              </n-timeline-item>
            </n-timeline>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
import { 
  NCard, 
  NDataTable, 
  NInput, 
  NSelect, 
  NDatePicker, 
  NButton, 
  NSpace, 
  NModal, 
  NDescriptions, 
  NDescriptionsItem, 
  NTag, 
  NIcon,
  NTabs,
  NTabPane,
  NTimeline,
  NTimelineItem,
  NGrid,
  NGridItem,
  NStatistic,
  useMessage,
  type DataTableColumns
} from 'naive-ui'
import { Search, Refresh, Download, Eye } from '@vicons/ionicons5'
import { getOrderList, getOrderStats } from '@/api/order'
import { useUserStore } from '@/store/modules/user'

// 类型定义
interface Order {
  id: number
  order_no: string
  user_name: string
  feeder_name: string
  service_name: string
  pet_name: string
  status: number
  amount: number
  payment_method: string
  service_date: string
  service_time: string
  service_address: string
  remark?: string
  created_at: string
  pay_time?: string
  timeline?: Array<{
    type: 'success' | 'warning' | 'error' | 'info'
    title: string
    description: string
    time: string
  }>
}

interface SearchForm {
  keyword: string
  status: number | null
  dateRange: [string, string] | null
}

interface OrderStats {
  todayOrders: number
  pendingOrders: number
  todayAmount: number
  completionRate: number
}

// 响应式数据
const loading = ref(false)
const tableData = ref<Order[]>([])
const currentOrder = ref<Order | null>(null)
const showDetailModal = ref(false)

const stats = ref<OrderStats>({
  todayOrders: 0,
  pendingOrders: 0,
  todayAmount: 0,
  completionRate: 0
})

const searchForm = reactive<SearchForm>({
  keyword: '',
  status: null,
  dateRange: null
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  total: 0,
  onChange: (page: number) => {
    pagination.page = page
    fetchData()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    fetchData()
  }
})

// 状态选项
const statusOptions = [
  { label: '待支付', value: 0 },
  { label: '待服务', value: 1 },
  { label: '服务中', value: 2 },
  { label: '已完成', value: 3 },
  { label: '已取消', value: 4 },
  { label: '已退款', value: 5 }
]

// 权限控制
const userStore = useUserStore()
const canViewAmount = computed(() => userStore.getUserInfo.roles?.includes('super'))

// 消息提示
const message = useMessage()

// 表格列配置
const baseColumns: DataTableColumns<Order> = [
  {
    title: '订单号',
    key: 'order_no',
    width: 180
  },
  {
    title: '用户',
    key: 'user_name',
    width: 120
  },
  {
    title: '喂养员',
    key: 'feeder_name',
    width: 120
  },
  {
    title: '服务项目',
    key: 'service_name',
    width: 150
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(NTag, {
        type: getStatusType(row.status),
        size: 'small'
      }, { default: () => getStatusText(row.status) })
    }
  },
  {
    title: '下单时间',
    key: 'created_at',
    width: 160,
    render(row) {
      return formatDate(row.created_at)
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render(row) {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            type: 'primary',
            onClick: () => handleViewDetail(row)
          }, { default: () => '查看' })
        ]
      })
    }
  }
]

const amountColumn = {
  title: '金额',
  key: 'amount',
  width: 120,
  render(row: Order) {
    return canViewAmount.value ? `¥${row.amount}` : '***'
  }
}

// 计算表格列
const tableColumns = computed(() => {
  const columns = [...baseColumns]
  // 在状态列之前插入金额列
  const statusIndex = columns.findIndex(col => col.key === 'status')
  if (statusIndex > -1) {
    columns.splice(statusIndex, 0, amountColumn)
  }
  return columns
})

// 工具函数
const getStatusType = (status: number) => {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'info'
    case 2: return 'processing'
    case 3: return 'success'
    case 4: return 'error'
    case 5: return 'default'
    default: return 'default'
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return '待支付'
    case 1: return '待服务'
    case 2: return '服务中'
    case 3: return '已完成'
    case 4: return '已取消'
    case 5: return '已退款'
    default: return '未知'
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

const formatDateTime = (date: string, time: string) => {
  if (!date || !time) return '-'
  const dateObj = new Date(date)
  const month = dateObj.getMonth() + 1
  const day = dateObj.getDate()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  const weekday = weekdays[dateObj.getDay()]
  return `${month}月${day}日 周${weekday} ${time}`
}

// API调用
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword,
      status: searchForm.status,
      dateRange: searchForm.dateRange
    }
    
    const response = await getOrderList(params)
    tableData.value = response.data || []
    pagination.total = response.total || 0
  } catch (error) {
    message.error('获取订单列表失败')
    console.error('获取订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await getOrderStats()
    stats.value = response
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

// 事件处理
const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = null
  searchForm.dateRange = null
  pagination.page = 1
  fetchData()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  fetchData()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  fetchData()
}

const handleRefresh = () => {
  fetchData()
  fetchStats()
}

const handleExport = () => {
  message.info('导出功能开发中...')
}

const handleViewDetail = (row: Order) => {
  currentOrder.value = row
  showDetailModal.value = true
}

// 生命周期
onMounted(() => {
  fetchData()
  fetchStats()
})
</script>

<style scoped>
.order-list-container {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}

.search-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.action-bar {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style> 