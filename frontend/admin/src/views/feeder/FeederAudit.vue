<template>
  <div class="feeder-audit-container">
    <n-card title="审核中心" :bordered="false">
      <!-- 统计信息 -->
      <n-grid :cols="4" :x-gap="16" :y-gap="16" class="mb-4">
        <n-grid-item>
          <n-card hoverable>
            <n-statistic label="待审核" :value="stats.pending" />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card hoverable>
            <n-statistic label="今日审核" :value="stats.todayAudited" />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card hoverable>
            <n-statistic label="通过率" :value="stats.passRate" suffix="%" />
          </n-card>
        </n-grid-item>
        <n-grid-item>
          <n-card hoverable>
            <n-statistic label="平均审核时长" :value="stats.avgAuditTime" suffix="分钟" />
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <n-space>
          <n-select
            v-model:value="filterForm.status"
            placeholder="审核状态"
            style="width: 150px"
            :options="statusOptions"
            clearable
          />
          <n-date-picker
            v-model:value="filterForm.dateRange"
            type="daterange"
            placeholder="申请日期范围"
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

      <!-- 审核列表 -->
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

    <!-- 审核弹窗 -->
    <n-modal v-model:show="showAuditModal" preset="card" title="审核喂养员" style="width: 700px">
      <div v-if="currentApplication">
        <n-tabs type="line" animated>
          <n-tab-pane name="basic" tab="基本信息">
            <n-descriptions :column="2" bordered>
              <n-descriptions-item label="姓名">{{ currentApplication.name }}</n-descriptions-item>
              <n-descriptions-item label="手机号">{{ currentApplication.phone }}</n-descriptions-item>
              <n-descriptions-item label="身份证">{{ currentApplication.id_card }}</n-descriptions-item>
              <n-descriptions-item label="申请时间">{{ formatDate(currentApplication.created_at) }}</n-descriptions-item>
              <n-descriptions-item label="地址" :span="2">{{ currentApplication.address }}</n-descriptions-item>
              <n-descriptions-item label="简介" :span="2">{{ currentApplication.bio || '暂无简介' }}</n-descriptions-item>
            </n-descriptions>
          </n-tab-pane>
          
          <n-tab-pane name="documents" tab="证件材料">
            <n-space vertical>
              <div v-if="currentApplication.id_card_front">
                <div class="document-label">身份证正面</div>
                <n-image
                  :src="currentApplication.id_card_front"
                  width="200"
                  height="120"
                  object-fit="cover"
                  preview-disabled
                />
              </div>
              <div v-if="currentApplication.id_card_back">
                <div class="document-label">身份证背面</div>
                <n-image
                  :src="currentApplication.id_card_back"
                  width="200"
                  height="120"
                  object-fit="cover"
                  preview-disabled
                />
              </div>
              <div v-if="currentApplication.avatar">
                <div class="document-label">头像照片</div>
                <n-image
                  :src="currentApplication.avatar"
                  width="120"
                  height="120"
                  object-fit="cover"
                  preview-disabled
                />
              </div>
            </n-space>
          </n-tab-pane>
        </n-tabs>

        <!-- 审核操作 -->
        <div class="audit-actions">
          <n-space justify="center">
            <n-button type="success" size="large" @click="handleApprove">
              <template #icon>
                <n-icon><CheckmarkCircle /></n-icon>
              </template>
              通过审核
            </n-button>
            <n-button type="error" size="large" @click="handleReject">
              <template #icon>
                <n-icon><CloseCircle /></n-icon>
              </template>
              拒绝申请
            </n-button>
            <n-button @click="showAuditModal = false">取消</n-button>
          </n-space>
        </div>
      </div>
    </n-modal>

    <!-- 拒绝原因弹窗 -->
    <n-modal v-model:show="showRejectModal" preset="card" title="拒绝原因" style="width: 500px">
      <n-form ref="rejectFormRef" :model="rejectForm" :rules="rejectRules">
        <n-form-item label="拒绝原因" path="reason">
          <n-select
            v-model:value="rejectForm.reason"
            placeholder="选择拒绝原因"
            :options="rejectReasonOptions"
            clearable
          />
        </n-form-item>
        <n-form-item label="详细说明" path="detail">
          <n-input
            v-model:value="rejectForm.detail"
            type="textarea"
            placeholder="请输入详细的拒绝原因"
            :rows="4"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showRejectModal = false">取消</n-button>
          <n-button type="error" @click="confirmReject">确认拒绝</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, h } from 'vue'
import { 
  NCard, 
  NDataTable, 
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
  NImage,
  NForm,
  NFormItem,
  NInput,
  NGrid,
  NGridItem,
  NStatistic,
  useMessage,
  type DataTableColumns,
  type FormInst
} from 'naive-ui'
import { Search, CheckmarkCircle, CloseCircle, Eye } from '@vicons/ionicons5'
import { getFeederAuditList, approveFeeder, rejectFeeder, getAuditStats } from '@/api/feeder'

// 类型定义
interface FeederApplication {
  id: number
  name: string
  phone: string
  id_card: string
  status: number
  address: string
  bio?: string
  created_at: string
  id_card_front?: string
  id_card_back?: string
  avatar?: string
  audit_time?: string
  audit_user?: string
  reject_reason?: string
}

interface FilterForm {
  status: number | null
  dateRange: [string, string] | null
}

interface RejectForm {
  reason: string
  detail: string
}

interface AuditStats {
  pending: number
  todayAudited: number
  passRate: number
  avgAuditTime: number
}

// 响应式数据
const loading = ref(false)
const tableData = ref<FeederApplication[]>([])
const currentApplication = ref<FeederApplication | null>(null)
const showAuditModal = ref(false)
const showRejectModal = ref(false)
const rejectFormRef = ref<FormInst | null>(null)

const stats = ref<AuditStats>({
  pending: 0,
  todayAudited: 0,
  passRate: 0,
  avgAuditTime: 0
})

const filterForm = reactive<FilterForm>({
  status: null,
  dateRange: null
})

const rejectForm = reactive<RejectForm>({
  reason: '',
  detail: ''
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
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '已拒绝', value: 2 }
]

const rejectReasonOptions = [
  { label: '证件信息不清晰', value: '证件信息不清晰' },
  { label: '身份证信息与申请信息不符', value: '身份证信息与申请信息不符' },
  { label: '地址信息不准确', value: '地址信息不准确' },
  { label: '其他原因', value: '其他原因' }
]

const rejectRules = {
  reason: {
    required: true,
    message: '请选择拒绝原因',
    trigger: 'change'
  },
  detail: {
    required: true,
    message: '请输入详细说明',
    trigger: 'blur'
  }
}

// 消息提示
const message = useMessage()

// 表格列配置
const columns: DataTableColumns<FeederApplication> = [
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
    title: '申请时间',
    key: 'created_at',
    width: 160,
    render(row) {
      return formatDate(row.created_at)
    }
  },
  {
    title: '审核时间',
    key: 'audit_time',
    width: 160,
    render(row) {
      return row.audit_time ? formatDate(row.audit_time) : '-'
    }
  },
  {
    title: '审核人',
    key: 'audit_user',
    width: 120,
    render(row) {
      return row.audit_user || '-'
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render(row) {
      if (row.status === 0) {
        return h(NSpace, { size: 'small' }, {
          default: () => [
            h(NButton, {
              size: 'small',
              type: 'primary',
              onClick: () => handleAudit(row)
            }, { default: () => '审核' })
          ]
        })
      } else {
        return h(NSpace, { size: 'small' }, {
          default: () => [
            h(NButton, {
              size: 'small',
              type: 'info',
              onClick: () => handleViewDetail(row)
            }, { default: () => '查看' })
          ]
        })
      }
    }
  }
]

// 工具函数
const getStatusType = (status: number) => {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'success'
    case 2: return 'error'
    default: return 'default'
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return '待审核'
    case 1: return '已通过'
    case 2: return '已拒绝'
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
      status: filterForm.status,
      dateRange: filterForm.dateRange
    }
    
    const response = await getFeederAuditList(params)
    tableData.value = response.data || []
    pagination.total = response.total || 0
  } catch (error) {
    message.error('获取审核列表失败')
    console.error('获取审核列表失败:', error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await getAuditStats()
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
  filterForm.status = null
  filterForm.dateRange = null
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

const handleAudit = (row: FeederApplication) => {
  currentApplication.value = row
  showAuditModal.value = true
}

const handleViewDetail = (row: FeederApplication) => {
  currentApplication.value = row
  showAuditModal.value = true
}

const handleApprove = async () => {
  if (!currentApplication.value) return
  
  try {
    await approveFeeder(currentApplication.value.id)
    message.success('审核通过成功')
    showAuditModal.value = false
    fetchData()
    fetchStats()
  } catch (error) {
    message.error('审核操作失败')
    console.error('审核操作失败:', error)
  }
}

const handleReject = () => {
  showRejectModal.value = true
}

const confirmReject = async () => {
  if (!currentApplication.value) return
  
  try {
    await rejectFormRef.value?.validate()
    
    await rejectFeeder(currentApplication.value.id, {
      reason: rejectForm.reason,
      detail: rejectForm.detail
    })
    
    message.success('拒绝申请成功')
    showRejectModal.value = false
    showAuditModal.value = false
    
    // 重置表单
    rejectForm.reason = ''
    rejectForm.detail = ''
    
    fetchData()
    fetchStats()
  } catch (error) {
    if (error !== false) {
      message.error('拒绝操作失败')
      console.error('拒绝操作失败:', error)
    }
  }
}

// 生命周期
onMounted(() => {
  fetchData()
  fetchStats()
})
</script>

<style scoped>
.feeder-audit-container {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}

.filter-bar {
  margin-bottom: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.document-label {
  font-weight: 500;
  margin-bottom: 8px;
  color: #666;
}

.audit-actions {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style> 