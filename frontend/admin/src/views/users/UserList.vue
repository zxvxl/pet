<template>
  <div class="user-container">
    <n-card title="用户列表" :bordered="false">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <n-space>
          <n-input
            v-model:value="searchForm.keyword"
            placeholder="搜索用户名/手机号"
            style="width: 200px"
            clearable
          />
          <n-select
            v-model:value="searchForm.status"
            :options="statusOptions"
            placeholder="用户状态"
            style="width: 120px"
            clearable
          />
          <n-date-picker
            v-model:value="searchForm.dateRange"
            type="daterange"
            placeholder="注册时间范围"
            style="width: 240px"
            clearable
          />
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <n-icon><Search /></n-icon>
            </template>
            搜索
          </n-button>
          <n-button @click="handleReset">
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            重置
          </n-button>
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
    </n-card>

    <!-- 用户详情弹窗 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="用户详情" style="width: 600px">
      <n-descriptions :column="2" bordered>
        <n-descriptions-item label="用户ID">{{ currentUser.id }}</n-descriptions-item>
        <n-descriptions-item label="用户名">{{ currentUser.username }}</n-descriptions-item>
        <n-descriptions-item label="手机号">{{ currentUser.phone }}</n-descriptions-item>
        <n-descriptions-item label="邮箱">{{ currentUser.email || '-' }}</n-descriptions-item>
        <n-descriptions-item label="注册时间">{{ formatDate(currentUser.created_at) }}</n-descriptions-item>
        <n-descriptions-item label="最后登录">{{ formatDate(currentUser.last_login_at) }}</n-descriptions-item>
        <n-descriptions-item label="状态">
          <n-tag :type="currentUser.status ? 'success' : 'error'" size="small">
            {{ currentUser.status ? '正常' : '禁用' }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="宠物数量">{{ currentUser.pet_count || 0 }}</n-descriptions-item>
        <n-descriptions-item label="订单数量">{{ currentUser.order_count || 0 }}</n-descriptions-item>
        <n-descriptions-item label="备注" :span="2">{{ currentUser.remark || '-' }}</n-descriptions-item>
      </n-descriptions>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
          <n-button type="primary" @click="handleViewOrders">查看订单</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, computed } from 'vue'
import { 
  NCard, 
  NDataTable, 
  NButton, 
  NSpace, 
  NInput, 
  NSelect, 
  NDatePicker,
  NModal, 
  NDescriptions, 
  NDescriptionsItem,
  NTag,
  NIcon,
  useMessage,
  type DataTableColumns
} from 'naive-ui'
import { Search, Refresh, Eye, Edit, Trash } from '@vicons/ionicons5'

// 类型定义
interface User {
  id: number
  username: string
  phone: string
  email?: string
  status: boolean
  created_at: string
  last_login_at?: string
  pet_count?: number
  order_count?: number
  remark?: string
}

interface SearchForm {
  keyword: string
  status: string | null
  dateRange: [string, string] | null
}

// 响应式数据
const loading = ref(false)
const tableData = ref<User[]>([])
const showDetailModal = ref(false)
const currentUser = ref<User>({} as User)

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

// 选项配置
const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'inactive' }
]

// 消息提示
const message = useMessage()

// 表格列配置
const columns: DataTableColumns<User> = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '用户名',
    key: 'username',
    width: 120
  },
  {
    title: '手机号',
    key: 'phone',
    width: 130
  },
  {
    title: '邮箱',
    key: 'email',
    width: 180,
    render(row) {
      return row.email || '-'
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(NTag, {
        type: row.status ? 'success' : 'error',
        size: 'small'
      }, { default: () => row.status ? '正常' : '禁用' })
    }
  },
  {
    title: '宠物数量',
    key: 'pet_count',
    width: 100,
    render(row) {
      return row.pet_count || 0
    }
  },
  {
    title: '订单数量',
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
            type: 'info',
            onClick: () => handleViewDetail(row)
          }, { default: () => '查看' }),
          h(NButton, {
            size: 'small',
            type: 'primary',
            onClick: () => handleEdit(row)
          }, { default: () => '编辑' }),
          h(NButton, {
            size: 'small',
            type: 'error',
            onClick: () => handleDelete(row)
          }, { default: () => '删除' })
        ]
      })
    }
  }
]

// 工具函数
const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

// API调用
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟数据
    const mockData: User[] = [
      {
        id: 1,
        username: '张三',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        status: true,
        created_at: '2024-01-01 10:00:00',
        last_login_at: '2024-01-15 14:30:00',
        pet_count: 2,
        order_count: 5,
        remark: '优质用户'
      },
      {
        id: 2,
        username: '李四',
        phone: '13800138002',
        status: true,
        created_at: '2024-01-02 11:00:00',
        last_login_at: '2024-01-14 16:20:00',
        pet_count: 1,
        order_count: 3
      },
      {
        id: 3,
        username: '王五',
        phone: '13800138003',
        email: 'wangwu@example.com',
        status: false,
        created_at: '2024-01-03 09:00:00',
        pet_count: 0,
        order_count: 0,
        remark: '账号异常'
      }
    ]
    
    tableData.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    message.error('获取用户列表失败')
    console.error('获取用户列表失败:', error)
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
  searchForm.dateRange = null
  pagination.page = 1
  fetchData()
}

const handleViewDetail = (row: User) => {
  currentUser.value = row
  showDetailModal.value = true
}

const handleEdit = (row: User) => {
  message.info('编辑功能开发中...')
}

const handleDelete = async (row: User) => {
  try {
    await window.$dialog.warning({
      title: '确认删除',
      content: `确定要删除用户"${row.username}"吗？`,
      positiveText: '确定',
      negativeText: '取消'
    })
    
    message.success('删除成功')
    fetchData()
  } catch (error) {
    // 用户取消删除
  }
}

const handleViewOrders = () => {
  showDetailModal.value = false
  // 跳转到订单列表并筛选该用户的订单
  message.info('跳转到订单列表功能开发中...')
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

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 16px;
}
</style> 