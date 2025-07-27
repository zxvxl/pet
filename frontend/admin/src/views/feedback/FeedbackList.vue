<template>
  <div class="feedback-container">
    <n-card title="反馈投诉" :bordered="false">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <n-space>
          <n-input
            v-model:value="searchForm.keyword"
            placeholder="搜索用户/内容"
            style="width: 200px"
            clearable
          />
          <n-select
            v-model:value="searchForm.type"
            :options="typeOptions"
            placeholder="反馈类型"
            style="width: 120px"
            clearable
          />
          <n-select
            v-model:value="searchForm.status"
            :options="statusOptions"
            placeholder="处理状态"
            style="width: 120px"
            clearable
          />
          <n-date-picker
            v-model:value="searchForm.dateRange"
            type="daterange"
            placeholder="提交时间范围"
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

    <!-- 反馈详情弹窗 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="反馈详情" style="width: 700px">
      <n-descriptions :column="2" bordered>
        <n-descriptions-item label="反馈ID">{{ currentFeedback.id }}</n-descriptions-item>
        <n-descriptions-item label="用户">{{ currentFeedback.user_name }}</n-descriptions-item>
        <n-descriptions-item label="反馈类型">
          <n-tag :type="getTypeColor(currentFeedback.type)" size="small">
            {{ getTypeText(currentFeedback.type) }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="处理状态">
          <n-tag :type="currentFeedback.status === 'processed' ? 'success' : 'warning'" size="small">
            {{ currentFeedback.status === 'processed' ? '已处理' : '待处理' }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="提交时间">{{ formatDate(currentFeedback.created_at) }}</n-descriptions-item>
        <n-descriptions-item label="处理时间">{{ formatDate(currentFeedback.processed_at) || '-' }}</n-descriptions-item>
        <n-descriptions-item label="联系方式">{{ currentFeedback.contact || '-' }}</n-descriptions-item>
        <n-descriptions-item label="优先级">
          <n-tag :type="getPriorityColor(currentFeedback.priority)" size="small">
            {{ getPriorityText(currentFeedback.priority) }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item label="反馈内容" :span="2">{{ currentFeedback.content }}</n-descriptions-item>
        <n-descriptions-item label="处理备注" :span="2">{{ currentFeedback.remark || '-' }}</n-descriptions-item>
      </n-descriptions>
      
      <!-- 反馈图片 -->
      <div v-if="currentFeedback.images && currentFeedback.images.length > 0" style="margin-top: 16px;">
        <h4>反馈图片</h4>
        <n-image-group>
          <n-space>
            <n-image
              v-for="(image, index) in currentFeedback.images"
              :key="index"
              :src="image"
              :width="100"
              :height="100"
              object-fit="cover"
              preview-disabled
            />
          </n-space>
        </n-image-group>
      </div>
      
      <!-- 处理表单 -->
      <div v-if="currentFeedback.status === 'pending'" style="margin-top: 16px;">
        <h4>处理反馈</h4>
        <n-form ref="processFormRef" :model="processForm" :rules="processRules" label-placement="left" label-width="100px">
          <n-form-item label="处理备注" path="remark">
            <n-input v-model:value="processForm.remark" type="textarea" placeholder="请输入处理备注" />
          </n-form-item>
        </n-form>
      </div>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
          <n-button v-if="currentFeedback.status === 'pending'" type="primary" @click="handleProcess">
            标记已处理
          </n-button>
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
  NImage,
  NImageGroup,
  NForm,
  NFormItem,
  useMessage,
  type DataTableColumns,
  type FormInst
} from 'naive-ui'
import { Search, Refresh, Eye, Warning } from '@vicons/ionicons5'

// 类型定义
interface Feedback {
  id: number
  user_name: string
  type: 'bug' | 'suggestion' | 'experience' | 'other'
  content: string
  contact?: string
  images?: string[]
  status: 'pending' | 'processed'
  priority: 'low' | 'medium' | 'high'
  remark?: string
  created_at: string
  processed_at?: string
}

interface SearchForm {
  keyword: string
  type: string | null
  status: string | null
  dateRange: [string, string] | null
}

interface ProcessForm {
  remark: string
}

// 响应式数据
const loading = ref(false)
const tableData = ref<Feedback[]>([])
const showDetailModal = ref(false)
const currentFeedback = ref<Feedback>({} as Feedback)
const processFormRef = ref<FormInst | null>(null)

const searchForm = reactive<SearchForm>({
  keyword: '',
  type: null,
  status: null,
  dateRange: null
})

const processForm = reactive<ProcessForm>({
  remark: ''
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
const typeOptions = [
  { label: '功能异常', value: 'bug' },
  { label: '建议反馈', value: 'suggestion' },
  { label: '体验问题', value: 'experience' },
  { label: '其他', value: 'other' }
]

const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '已处理', value: 'processed' }
]

// 表单验证规则
const processRules = {
  remark: {
    required: true,
    message: '请输入处理备注',
    trigger: 'blur'
  }
}

// 消息提示
const message = useMessage()

// 工具函数
const getTypeText = (type: string) => {
  const typeMap = {
    bug: '功能异常',
    suggestion: '建议反馈',
    experience: '体验问题',
    other: '其他'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const getTypeColor = (type: string) => {
  const colorMap = {
    bug: 'error',
    suggestion: 'info',
    experience: 'warning',
    other: 'default'
  }
  return colorMap[type as keyof typeof colorMap] || 'default'
}

const getPriorityText = (priority: string) => {
  const priorityMap = {
    low: '低',
    medium: '中',
    high: '高'
  }
  return priorityMap[priority as keyof typeof priorityMap] || priority
}

const getPriorityColor = (priority: string) => {
  const colorMap = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }
  return colorMap[priority as keyof typeof colorMap] || 'default'
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

// 表格列配置
const columns: DataTableColumns<Feedback> = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '用户',
    key: 'user_name',
    width: 100
  },
  {
    title: '反馈类型',
    key: 'type',
    width: 120,
    render(row) {
      return h(NTag, {
        type: getTypeColor(row.type),
        size: 'small'
      }, { default: () => getTypeText(row.type) })
    }
  },
  {
    title: '优先级',
    key: 'priority',
    width: 100,
    render(row) {
      return h(NTag, {
        type: getPriorityColor(row.priority),
        size: 'small'
      }, { default: () => getPriorityText(row.priority) })
    }
  },
  {
    title: '反馈内容',
    key: 'content',
    width: 300,
    render(row) {
      return row.content.length > 50 ? row.content.substring(0, 50) + '...' : row.content
    }
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(NTag, {
        type: row.status === 'processed' ? 'success' : 'warning',
        size: 'small'
      }, { default: () => row.status === 'processed' ? '已处理' : '待处理' })
    }
  },
  {
    title: '提交时间',
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
            type: 'info',
            onClick: () => handleViewDetail(row)
          }, { default: () => '查看' }),
          h(NButton, {
            v-if: row.status === 'pending',
            size: 'small',
            type: 'primary',
            onClick: () => handleProcess(row)
          }, { default: () => '处理' })
        ]
      })
    }
  }
]

// API调用
const fetchData = async () => {
  loading.value = true
  try {
    // 模拟数据
    const mockData: Feedback[] = [
      {
        id: 1,
        user_name: '张三',
        type: 'bug',
        content: '订单支付后页面没有跳转，一直显示加载中',
        contact: '13800138001',
        images: ['https://via.placeholder.com/100x100?text=BUG1'],
        status: 'processed',
        priority: 'high',
        remark: '已修复支付跳转问题',
        created_at: '2024-01-15 10:30:00',
        processed_at: '2024-01-15 14:20:00'
      },
      {
        id: 2,
        user_name: '李四',
        type: 'suggestion',
        content: '建议增加宠物健康档案功能，方便记录宠物的健康状况',
        contact: '13800138002',
        status: 'pending',
        priority: 'medium',
        created_at: '2024-01-15 16:20:00'
      },
      {
        id: 3,
        user_name: '王五',
        type: 'experience',
        content: '喂养员服务时间太晚了，希望能提前一些',
        contact: '13800138003',
        images: ['https://via.placeholder.com/100x100?text=EXP1'],
        status: 'pending',
        priority: 'low',
        created_at: '2024-01-15 18:10:00'
      }
    ]
    
    tableData.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    message.error('获取反馈列表失败')
    console.error('获取反馈列表失败:', error)
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
  searchForm.type = null
  searchForm.status = null
  searchForm.dateRange = null
  pagination.page = 1
  fetchData()
}

const handleViewDetail = (row: Feedback) => {
  currentFeedback.value = row
  processForm.remark = ''
  showDetailModal.value = true
}

const handleProcess = async (row?: Feedback) => {
  const targetFeedback = row || currentFeedback.value
  
  if (!row) {
    // 从弹窗处理
    try {
      await processFormRef.value?.validate()
    } catch (error) {
      return
    }
  }
  
  try {
    await window.$dialog.warning({
      title: '确认处理',
      content: `确定要标记反馈"${targetFeedback.id}"为已处理吗？`,
      positiveText: '确定',
      negativeText: '取消'
    })
    
    message.success('处理成功')
    if (row) {
      fetchData()
    } else {
      showDetailModal.value = false
      fetchData()
    }
  } catch (error) {
    // 用户取消操作
  }
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
.feedback-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 16px;
}
</style>