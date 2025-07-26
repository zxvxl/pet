<!-- frontend/admin/src/views/users/UserList.vue -->
<template>
  <div class="user-list">
    <n-card :bordered="false" class="mb-4">
      <n-space vertical>
        <!-- 搜索表单 -->
        <n-form
          ref="searchFormRef"
          :model="searchForm"
          label-placement="left"
          :show-feedback="false"
          class="search-form"
        >
          <n-grid :cols="24" :x-gap="16">
            <n-form-item-gi :span="6" label="关键词">
              <n-input
                v-model:value="searchForm.keyword"
                placeholder="搜索用户名/手机号/昵称"
                clearable
                @keyup.enter="handleSearch"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="状态">
              <n-select
                v-model:value="searchForm.status"
                :options="statusOptions"
                placeholder="选择状态"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :span="8" label="注册时间">
              <n-date-picker
                v-model:value="searchForm.dateRange"
                type="daterange"
                clearable
                placeholder="选择时间范围"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="4">
              <n-space>
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
            </n-form-item-gi>
          </n-grid>
        </n-form>

        <!-- 操作按钮 -->
        <n-space>
          <n-button @click="handleExport" :loading="exportLoading">
            <template #icon>
              <n-icon><Download /></n-icon>
            </template>
            导出数据
          </n-button>
        </n-space>
      </n-space>
    </n-card>

    <n-card :bordered="false">
      <!-- 数据表格 -->
      <n-data-table
        ref="tableRef"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        flex-height
        style="min-height: 500px"
      />
    </n-card>

    <!-- 用户详情弹窗 -->
    <n-modal
      v-model:show="showDetailModal"
      :mask-closable="false"
      preset="card"
      title="用户详情"
      style="width: 800px"
    >
      <div v-if="currentUser" class="user-detail">
        <n-descriptions
          :column="2"
          bordered
          label-placement="left"
          label-style="width: 120px"
        >
          <n-descriptions-item label="头像">
            <n-avatar
              :src="currentUser.avatar"
              :size="60"
              round
              :fallback-src="defaultAvatar"
            />
          </n-descriptions-item>
          <n-descriptions-item label="用户ID">{{ currentUser.id }}</n-descriptions-item>
          <n-descriptions-item label="用户名">{{ currentUser.username }}</n-descriptions-item>
          <n-descriptions-item label="昵称">{{ currentUser.nickname || '未设置' }}</n-descriptions-item>
          <n-descriptions-item label="手机号">{{ formatPhone(currentUser.phone) }}</n-descriptions-item>
          <n-descriptions-item label="邮箱">{{ currentUser.email || '未设置' }}</n-descriptions-item>
          <n-descriptions-item label="性别">{{ formatGender(currentUser.gender) }}</n-descriptions-item>
          <n-descriptions-item label="生日">{{ formatDate(currentUser.birthday) || '未设置' }}</n-descriptions-item>
          <n-descriptions-item label="状态">
            <n-tag :type="getStatusType(currentUser.status)" size="small">
              {{ getStatusText(currentUser.status) }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="注册时间">{{ formatDate(currentUser.created_at) }}</n-descriptions-item>
          <n-descriptions-item label="最后登录">{{ formatDate(currentUser.last_login_at) || '从未登录' }}</n-descriptions-item>
          <n-descriptions-item label="地址" :span="2">{{ currentUser.address || '未设置' }}</n-descriptions-item>
        </n-descriptions>

        <!-- 用户统计 -->
        <n-divider />
        <h4>用户统计</h4>
        <n-grid :cols="3" :x-gap="16">
          <n-grid-item>
            <n-statistic label="订单总数" :value="currentUser.order_count || 0">
              <template #suffix>
                <n-text>单</n-text>
              </template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item>
            <n-statistic label="消费金额" :value="currentUser.total_amount || 0">
              <template #prefix>
                <n-text>¥</n-text>
              </template>
            </n-statistic>
          </n-grid-item>
          <n-grid-item>
            <n-statistic label="宠物数量" :value="currentUser.pet_count || 0">
              <template #suffix>
                <n-text>只</n-text>
              </template>
            </n-statistic>
          </n-grid-item>
        </n-grid>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 状态更新弹窗 -->
    <n-modal
      v-model:show="showStatusModal"
      :mask-closable="false"
      preset="dialog"
      :title="`${statusAction === 'enable' ? '启用' : '禁用'}用户`"
      :positive-text="statusAction === 'enable' ? '启用' : '禁用'"
      negative-text="取消"
      @positive-click="handleStatusConfirm"
    >
      <p>确定要{{ statusAction === 'enable' ? '启用' : '禁用' }}用户"{{ currentUser?.username }}"吗？</p>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
import {
  NCard,
  NSpace,
  NForm,
  NFormItem,
  NFormItemGi,
  NGrid,
  NGridItem,
  NInput,
  NSelect,
  NDatePicker,
  NButton,
  NIcon,
  NDataTable,
  NModal,
  NDescriptions,
  NDescriptionsItem,
  NAvatar,
  NTag,
  NText,
  NDivider,
  NStatistic,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import { Search, Refresh, Download, Eye, CheckCircle, CloseCircle } from '@vicons/ionicons5'
import { useUserStore } from '@/store/modules/user'
import { formatDate } from '@/utils'

// 类型定义
interface User {
  id: number
  username: string
  nickname?: string
  phone?: string
  email?: string
  avatar?: string
  gender?: number
  birthday?: string
  address?: string
  status: number
  order_count?: number
  total_amount?: number
  pet_count?: number
  created_at: string
  last_login_at?: string
}

interface SearchForm {
  keyword: string
  status: number | null
  dateRange: [string, string] | null
}

// 响应式数据
const loading = ref(false)
const exportLoading = ref(false)
const tableData = ref<User[]>([])
const currentUser = ref<User | null>(null)
const showDetailModal = ref(false)
const showStatusModal = ref(false)
const statusAction = ref<'enable' | 'disable'>('enable')

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive<SearchForm>({
  keyword: '',
  status: null,
  dateRange: null,
})

// 分页配置
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
  },
})

// 状态选项
const statusOptions = [
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 },
]

// 权限控制
const userStore = useUserStore()
const canManageUser = computed(() => {
  const permissions = userStore.getUserInfo.permissions || []
  return permissions.includes('user:manage') || userStore.getUserInfo.roles?.includes('super')
})

// 默认头像
const defaultAvatar = 'https://via.placeholder.com/60x60?text=头像'

// 消息提示
const message = useMessage()

// 表格列配置
const columns: DataTableColumns<User> = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: '头像',
    key: 'avatar',
    width: 80,
    render(row) {
      return h(NAvatar, {
        src: row.avatar,
        size: 'small',
        round: true,
        fallbackSrc: defaultAvatar,
      })
    },
  },
  {
    title: '用户名',
    key: 'username',
    width: 120,
  },
  {
    title: '昵称',
    key: 'nickname',
    width: 120,
    render(row) {
      return row.nickname || '未设置'
    },
  },
  {
    title: '手机号',
    key: 'phone',
    width: 140,
    render(row) {
      return formatPhone(row.phone)
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: getStatusType(row.status),
          size: 'small',
        },
        { default: () => getStatusText(row.status) }
      )
    },
  },
  {
    title: '订单数',
    key: 'order_count',
    width: 100,
    render(row) {
      return (row.order_count || 0) + '单'
    },
  },
  {
    title: '注册时间',
    key: 'created_at',
    width: 160,
    render(row) {
      return formatDate(row.created_at)
    },
  },
  {
    title: '最后登录',
    key: 'last_login_at',
    width: 160,
    render(row) {
      return formatDate(row.last_login_at) || '从未登录'
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render(row) {
      const actions = []
      
      actions.push(
        h(
          NButton,
          {
            size: 'small',
            type: 'info',
            onClick: () => handleViewDetail(row),
          },
          { default: () => '查看', icon: () => h(NIcon, null, { default: () => h(Eye) }) }
        )
      )

      if (canManageUser.value) {
        if (row.status === 1) {
          actions.push(
            h(
              NButton,
              {
                size: 'small',
                type: 'warning',
                onClick: () => handleStatusChange(row, 'disable'),
              },
              { default: () => '禁用', icon: () => h(NIcon, null, { default: () => h(CloseCircle) }) }
            )
          )
        } else {
          actions.push(
            h(
              NButton,
              {
                size: 'small',
                type: 'success',
                onClick: () => handleStatusChange(row, 'enable'),
              },
              { default: () => '启用', icon: () => h(NIcon, null, { default: () => h(CheckCircle) }) }
            )
          )
        }
      }

      return h(NSpace, { size: 'small' }, { default: () => actions })
    },
  },
]

// 工具函数
const getStatusType = (status: number) => {
  return status === 1 ? 'success' : 'error'
}

const getStatusText = (status: number) => {
  return status === 1 ? '正常' : '禁用'
}

const formatPhone = (phone?: string) => {
  if (!phone) return '未设置'
  return phone.replace(/^(.{3})(?:\d+)(.{4})$/, '$1****$2')
}

const formatGender = (gender?: number) => {
  const genderMap = { 0: '未知', 1: '男', 2: '女' }
  return genderMap[gender] || '未知'
}

// API调用
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    const mockData: User[] = [
      {
        id: 1,
        username: 'user001',
        nickname: '爱宠小主',
        phone: '13800138001',
        email: 'user001@example.com',
        gender: 1,
        status: 1,
        order_count: 15,
        total_amount: 2880.50,
        pet_count: 2,
        created_at: '2024-01-10 14:20:00',
        last_login_at: '2024-01-15 10:30:00',
      },
      {
        id: 2,
        username: 'user002',
        nickname: '猫咪爱好者',
        phone: '13800138002',
        email: 'user002@example.com',
        gender: 2,
        status: 1,
        order_count: 8,
        total_amount: 1560.00,
        pet_count: 1,
        created_at: '2024-01-12 16:45:00',
        last_login_at: '2024-01-14 08:15:00',
      },
      {
        id: 3,
        username: 'user003',
        nickname: '狗狗管家',
        phone: '13800138003',
        status: 0,
        order_count: 3,
        total_amount: 480.00,
        pet_count: 1,
        created_at: '2024-01-08 12:30:00',
        last_login_at: '2024-01-10 18:20:00',
      },
    ]

    // 根据搜索条件过滤数据
    let filteredData = mockData

    if (searchForm.keyword) {
      filteredData = filteredData.filter(user =>
        user.username.includes(searchForm.keyword) ||
        user.nickname?.includes(searchForm.keyword) ||
        user.phone?.includes(searchForm.keyword)
      )
    }

    if (searchForm.status !== null) {
      filteredData = filteredData.filter(user => user.status === searchForm.status)
    }

    tableData.value = filteredData
    pagination.total = filteredData.length
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

const handleStatusChange = (row: User, action: 'enable' | 'disable') => {
  currentUser.value = row
  statusAction.value = action
  showStatusModal.value = true
}

const handleStatusConfirm = async () => {
  if (!currentUser.value) return

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newStatus = statusAction.value === 'enable' ? 1 : 0
    currentUser.value.status = newStatus
    
    // 更新表格数据
    const index = tableData.value.findIndex(user => user.id === currentUser.value?.id)
    if (index !== -1) {
      tableData.value[index].status = newStatus
    }

    message.success(`${statusAction.value === 'enable' ? '启用' : '禁用'}成功`)
    showStatusModal.value = false
  } catch (error) {
    message.error(`${statusAction.value === 'enable' ? '启用' : '禁用'}失败`)
  }
}

const handleExport = async () => {
  try {
    exportLoading.value = true
    // 模拟导出
    await new Promise(resolve => setTimeout(resolve, 2000))
    message.success('导出成功')
  } catch (error) {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.user-list {
  padding: 16px;
}

.search-form {
  margin-bottom: 16px;
}

.user-detail {
  max-height: 600px;
  overflow-y: auto;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>