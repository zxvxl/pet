<template>
  <div class="review-container">
    <n-card title="评价列表" :bordered="false">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <n-space>
          <n-input
            v-model:value="searchForm.keyword"
            placeholder="搜索用户/喂养员"
            style="width: 200px"
            clearable
          />
          <n-select
            v-model:value="searchForm.rating"
            :options="ratingOptions"
            placeholder="评分筛选"
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
            placeholder="评价时间范围"
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

    <!-- 评价详情弹窗 -->
    <n-modal v-model:show="showDetailModal" preset="card" title="评价详情" style="width: 700px">
      <n-descriptions :column="2" bordered>
        <n-descriptions-item label="评价ID">{{ currentReview.id }}</n-descriptions-item>
        <n-descriptions-item label="订单号">{{ currentReview.order_no }}</n-descriptions-item>
        <n-descriptions-item label="用户">{{ currentReview.user_name }}</n-descriptions-item>
        <n-descriptions-item label="喂养员">{{ currentReview.feeder_name }}</n-descriptions-item>
        <n-descriptions-item label="评分">
          <n-rate :value="currentReview.rating" readonly />
        </n-descriptions-item>
        <n-descriptions-item label="评价时间">{{ formatDate(currentReview.created_at) }}</n-descriptions-item>
        <n-descriptions-item label="标签" :span="2">
          <n-space>
            <n-tag v-for="tag in currentReview.tags" :key="tag" size="small" type="info">
              {{ tag }}
            </n-tag>
          </n-space>
        </n-descriptions-item>
        <n-descriptions-item label="评价内容" :span="2">{{ currentReview.content }}</n-descriptions-item>
      </n-descriptions>
      
      <!-- 评价图片 -->
      <div v-if="currentReview.images && currentReview.images.length > 0" style="margin-top: 16px;">
        <h4>评价图片</h4>
        <n-image-group>
          <n-space>
            <n-image
              v-for="(image, index) in currentReview.images"
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
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
          <n-button v-if="currentReview.status === 'pending'" type="primary" @click="handleProcess">
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
  NRate,
  NImage,
  NImageGroup,
  useMessage,
  type DataTableColumns
} from 'naive-ui'
import { Search, Refresh, Eye, Star } from '@vicons/ionicons5'

// 类型定义
interface Review {
  id: number
  order_no: string
  user_name: string
  feeder_name: string
  rating: number
  tags: string[]
  content: string
  images?: string[]
  status: 'pending' | 'processed'
  created_at: string
}

interface SearchForm {
  keyword: string
  rating: number | null
  status: string | null
  dateRange: [string, string] | null
}

// 响应式数据
const loading = ref(false)
const tableData = ref<Review[]>([])
const showDetailModal = ref(false)
const currentReview = ref<Review>({} as Review)

const searchForm = reactive<SearchForm>({
  keyword: '',
  rating: null,
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
const ratingOptions = [
  { label: '5星', value: 5 },
  { label: '4星', value: 4 },
  { label: '3星', value: 3 },
  { label: '2星', value: 2 },
  { label: '1星', value: 1 }
]

const statusOptions = [
  { label: '待处理', value: 'pending' },
  { label: '已处理', value: 'processed' }
]

// 消息提示
const message = useMessage()

// 表格列配置
const columns: DataTableColumns<Review> = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '订单号',
    key: 'order_no',
    width: 150
  },
  {
    title: '用户',
    key: 'user_name',
    width: 100
  },
  {
    title: '喂养员',
    key: 'feeder_name',
    width: 100
  },
  {
    title: '评分',
    key: 'rating',
    width: 120,
    render(row) {
      return h(NSpace, { align: 'center' }, {
        default: () => [
          h(NRate, { value: row.rating, readonly: true, size: 'small' }),
          h('span', {}, `${row.rating}星`)
        ]
      })
    }
  },
  {
    title: '标签',
    key: 'tags',
    width: 200,
    render(row) {
      return h(NSpace, { size: 'small' }, {
        default: () => row.tags.map(tag => 
          h(NTag, { size: 'small', type: 'info' }, { default: () => tag })
        )
      })
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
    title: '评价时间',
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
    const mockData: Review[] = [
      {
        id: 1,
        order_no: 'ORD20240101001',
        user_name: '张三',
        feeder_name: '李师傅',
        rating: 5,
        tags: ['服务态度好', '专业', '准时'],
        content: '李师傅服务很专业，宠物很喜欢，下次还会预约！',
        images: ['https://via.placeholder.com/100x100?text=IMG1'],
        status: 'processed',
        created_at: '2024-01-15 14:30:00'
      },
      {
        id: 2,
        order_no: 'ORD20240101002',
        user_name: '李四',
        feeder_name: '王师傅',
        rating: 3,
        tags: ['一般'],
        content: '服务还可以，但是时间有点晚。',
        status: 'pending',
        created_at: '2024-01-15 16:20:00'
      },
      {
        id: 3,
        order_no: 'ORD20240101003',
        user_name: '王五',
        feeder_name: '赵师傅',
        rating: 1,
        tags: ['态度差', '不专业'],
        content: '服务态度很差，宠物都不愿意接近，非常不满意！',
        images: ['https://via.placeholder.com/100x100?text=IMG1', 'https://via.placeholder.com/100x100?text=IMG2'],
        status: 'pending',
        created_at: '2024-01-15 18:10:00'
      }
    ]
    
    tableData.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    message.error('获取评价列表失败')
    console.error('获取评价列表失败:', error)
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
  searchForm.rating = null
  searchForm.status = null
  searchForm.dateRange = null
  pagination.page = 1
  fetchData()
}

const handleViewDetail = (row: Review) => {
  currentReview.value = row
  showDetailModal.value = true
}

const handleProcess = async (row?: Review) => {
  const targetReview = row || currentReview.value
  try {
    await window.$dialog.warning({
      title: '确认处理',
      content: `确定要标记评价"${targetReview.order_no}"为已处理吗？`,
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
.review-container {
  padding: 20px;
}

.search-bar {
  margin-bottom: 16px;
}
</style>