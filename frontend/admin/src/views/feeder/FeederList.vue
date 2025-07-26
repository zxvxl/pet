<template>
  <div class="feeder-list-container">
    <n-card title="喂养员列表" :bordered="false">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <n-space>
          <n-input
            v-model:value="searchForm.keyword"
            placeholder="搜索姓名/手机号"
            style="width: 200px"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <n-icon><Search /></n-icon>
            </template>
          </n-input>
          <n-select
            v-model:value="searchForm.status"
            placeholder="状态筛选"
            style="width: 150px"
            :options="statusOptions"
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
        :columns="columns"
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

    <!-- 详情弹窗 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="喂养员详情" style="width: 600px">
      <div v-if="currentFeeder">
        <n-descriptions :column="2" bordered>
          <n-descriptions-item label="姓名">{{ currentFeeder.name }}</n-descriptions-item>
          <n-descriptions-item label="手机号">{{ currentFeeder.phone }}</n-descriptions-item>
          <n-descriptions-item label="身份证">{{ currentFeeder.id_card }}</n-descriptions-item>
          <n-descriptions-item label="状态">
            <n-tag :type="getStatusType(currentFeeder.status)">
              {{ getStatusText(currentFeeder.status) }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="注册时间">{{ formatDate(currentFeeder.created_at) }}</n-descriptions-item>
          <n-descriptions-item label="最后登录">{{ formatDate(currentFeeder.last_login_at) }}</n-descriptions-item>
          <n-descriptions-item label="地址" :span="2">{{ currentFeeder.address }}</n-descriptions-item>
          <n-descriptions-item label="简介" :span="2">{{ currentFeeder.bio || '暂无简介' }}</n-descriptions-item>
        </n-descriptions>
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
  NButton, 
  NSpace, 
  NModal, 
  NDescriptions, 
  NDescriptionsItem, 
  NTag, 
  NIcon,
  useMessage,
  type DataTableColumns
} from 'naive-ui'
import { Search, Refresh, Download, Eye, Edit, Trash } from '@vicons/ionicons5'
import { getFeederList, updateFeederStatus } from '@/api/feeder'
import { useUserStore } from '@/store/modules/user'

// 类型定义
interface FeederUser {
  id: number
  name: string
  phone: string
  id_card: string
  status: number
  address: string
  bio?: string
  created_at: string
  last_login_at?: string
  rating?: number
  order_count?: number
}

interface SearchForm {
  keyword: string
  status: number | null
}

// 响应式数据
const loading = ref(false)
const tableData = ref<FeederUser[]>([])
const currentFeeder = ref<FeederUser | null>(null)
const showDetailModal = ref(false)

const searchForm = reactive<SearchForm>({
  keyword: '',
  status: null
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
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '已拒绝', value: 2 },
  { label: '已禁用', value: 3 }
]

// 权限控制
const userStore = useUserStore()
const canViewAmount = computed(() => userStore.getUserInfo.roles?.includes('super'))

// 消息提示
const message = useMessage()

// 表格列配置
const columns: DataTableColumns<FeederUser> = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '姓名',
    key: 'name',
    width: 120
  },
  {
    title: '手机号',
    key: 'phone',
    width: 140
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
    title: '评分',
    key: 'rating',
    width: 100,
    render(row) {
      return row.rating ? `${row.rating.toFixed(1)}⭐` : '暂无'
    }
  },
  {
    title: '订单数',
    key: 'order_count',
    width: 100,
    render(row) {
      return row.order_count || 0
    }
  },
  {
    title: '注册时间',
    key: 'created_at',
    width: 160,
    render(row) {
      return formatDate(row.created_at)
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render(row) {
      return h(NSpace, { size: 'small' }, {
        default: () => [
          h(NButton, {
            size: 'small',
            type: 'primary',
            onClick: () => handleViewDetail(row)
          }, { default: () => '查看' }),
          h(NButton, {
            size: 'small',
            type: 'info',
            onClick: () => handleEdit(row)
          }, { default: () => '编辑' }),
          h(NButton, {
            size: 'small',
            type: row.status === 1 ? 'warning' : 'success',
            onClick: () => handleToggleStatus(row)
          }, { default: () => row.status === 1 ? '禁用' : '启用' })
        ]
      })
    }
  }
]

// 工具函数
const getStatusType = (status: number) => {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'success'
    case 2: return 'error'
    case 3: return 'default'
    default: return 'default'
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return '待审核'
    case 1: return '已通过'
    case 2: return '已拒绝'
    case 3: return '已禁用'
    default: return '未知'
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

// API调用
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword,
      status: searchForm.status
    }
    
    const response = await getFeederList(params)
    tableData.value = response.data || []
    pagination.total = response.total || 0
  } catch (error) {
    message.error('获取喂养员列表失败')
    console.error('获取喂养员列表失败:', error)
  } finally {
    loading.value = false
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
}

const handleExport = () => {
  message.info('导出功能开发中...')
}

const handleViewDetail = (row: FeederUser) => {
  currentFeeder.value = row
  showDetailModal.value = true
}

const handleEdit = (row: FeederUser) => {
  message.info('编辑功能开发中...')
}

const handleToggleStatus = async (row: FeederUser) => {
  try {
    const newStatus = row.status === 1 ? 3 : 1
    await updateFeederStatus(row.id, newStatus)
    message.success('状态更新成功')
    fetchData()
  } catch (error) {
    message.error('状态更新失败')
    console.error('状态更新失败:', error)
  }
}

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.feeder-list-container {
  padding: 20px;
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