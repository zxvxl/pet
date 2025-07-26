<!-- frontend/admin/src/views/feeders/FeederAudit.vue -->
<template>
  <div class="feeder-audit">
    <!-- 统计卡片 -->
    <n-grid :cols="4" :x-gap="16" class="mb-4">
      <n-grid-item>
        <n-card>
          <n-statistic label="待审核" :value="stats.pending">
            <template #suffix>
              <n-text>人</n-text>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card>
          <n-statistic label="今日审核" :value="stats.todayAudit">
            <template #suffix>
              <n-text>人</n-text>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card>
          <n-statistic label="通过率" :value="stats.passRate">
            <template #suffix>
              <n-text>%</n-text>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
      <n-grid-item>
        <n-card>
          <n-statistic label="平均审核时长" :value="stats.avgAuditTime">
            <template #suffix>
              <n-text>小时</n-text>
            </template>
          </n-statistic>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-card :bordered="false">
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
                placeholder="搜索姓名/手机号"
                clearable
                @keyup.enter="handleSearch"
              />
            </n-form-item-gi>
            <n-form-item-gi :span="6" label="状态">
              <n-select
                v-model:value="searchForm.status"
                :options="auditStatusOptions"
                placeholder="选择状态"
                clearable
              />
            </n-form-item-gi>
            <n-form-item-gi :span="8" label="申请时间">
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

        <!-- 批量操作 -->
        <n-space v-if="hasPermission('feeder:audit')">
          <n-button
            type="success"
            :disabled="!selectedRowKeys.length"
            @click="handleBatchAudit('approve')"
          >
            <template #icon>
              <n-icon><CheckCircle /></n-icon>
            </template>
            批量通过
          </n-button>
          <n-button
            type="error"
            :disabled="!selectedRowKeys.length"
            @click="handleBatchAudit('reject')"
          >
            <template #icon>
              <n-icon><CloseCircle /></n-icon>
            </template>
            批量拒绝
          </n-button>
        </n-space>
      </n-space>

      <!-- 数据表格 -->
      <n-data-table
        ref="tableRef"
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="(row) => row.id"
        :checked-row-keys="selectedRowKeys"
        @update:checked-row-keys="handleRowKeysChange"
        flex-height
        style="min-height: 500px; margin-top: 16px"
      />
    </n-card>

    <!-- 审核详情弹窗 -->
    <n-modal
      v-model:show="showAuditModal"
      :mask-closable="false"
      preset="card"
      title="审核详情"
      style="width: 900px"
    >
      <div v-if="currentFeeder" class="audit-detail">
        <n-tabs default-value="basic" type="line">
          <n-tab-pane name="basic" tab="基本信息">
            <n-descriptions
              :column="2"
              bordered
              label-placement="left"
              label-style="width: 120px"
            >
              <n-descriptions-item label="头像">
                <n-avatar
                  :src="currentFeeder.avatar"
                  :size="80"
                  round
                  :fallback-src="defaultAvatar"
                />
              </n-descriptions-item>
              <n-descriptions-item label="姓名">{{ currentFeeder.name }}</n-descriptions-item>
              <n-descriptions-item label="手机号">{{ currentFeeder.phone }}</n-descriptions-item>
              <n-descriptions-item label="身份证号">{{ currentFeeder.id_card }}</n-descriptions-item>
              <n-descriptions-item label="地址" :span="2">{{ currentFeeder.address || '暂无' }}</n-descriptions-item>
              <n-descriptions-item label="个人简介" :span="2">{{ currentFeeder.bio || '暂无' }}</n-descriptions-item>
              <n-descriptions-item label="工作经验" :span="2">{{ currentFeeder.experience || '暂无' }}</n-descriptions-item>
              <n-descriptions-item label="申请时间">{{ formatDate(currentFeeder.created_at) }}</n-descriptions-item>
              <n-descriptions-item label="状态">
                <n-tag :type="getStatusType(currentFeeder.status)" size="small">
                  {{ getStatusText(currentFeeder.status) }}
                </n-tag>
              </n-descriptions-item>
            </n-descriptions>
          </n-tab-pane>
          
          <n-tab-pane name="certificates" tab="资质证书">
            <n-grid v-if="currentFeeder.certificates && currentFeeder.certificates.length" :cols="3" :x-gap="12" :y-gap="12">
              <n-grid-item v-for="(cert, index) in currentFeeder.certificates" :key="index">
                <n-card size="small">
                  <n-image
                    :src="cert"
                    width="200"
                    height="150"
                    object-fit="cover"
                    :fallback-src="defaultCertImage"
                    preview
                  />
                </n-card>
              </n-grid-item>
            </n-grid>
            <n-empty v-else description="暂无证书" />
          </n-tab-pane>
        </n-tabs>

        <!-- 审核表单 -->
        <n-divider />
        <n-form
          ref="auditFormRef"
          :model="auditForm"
          label-placement="left"
          label-width="80px"
        >
          <n-form-item label="审核结果" path="action">
            <n-radio-group v-model:value="auditForm.action">
              <n-space>
                <n-radio value="approve">通过</n-radio>
                <n-radio value="reject">拒绝</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item
            v-if="auditForm.action === 'reject'"
            label="拒绝原因"
            path="rejection_reason"
          >
            <n-input
              v-model:value="auditForm.rejection_reason"
              type="textarea"
              :rows="3"
              placeholder="请输入拒绝原因"
            />
          </n-form-item>
        </n-form>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showAuditModal = false">取消</n-button>
          <n-button
            type="primary"
            :loading="auditLoading"
            @click="handleAuditSubmit"
          >
            提交审核
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 批量审核弹窗 -->
    <n-modal
      v-model:show="showBatchAuditModal"
      :mask-closable="false"
      preset="card"
      :title="`批量${batchAction === 'approve' ? '通过' : '拒绝'}审核`"
      style="width: 500px"
    >
      <div>
        <p>确定要{{ batchAction === 'approve' ? '通过' : '拒绝' }}选中的 {{ selectedRowKeys.length }} 个喂养员申请吗？</p>
        
        <n-form
          v-if="batchAction === 'reject'"
          ref="batchAuditFormRef"
          :model="batchAuditForm"
          label-placement="top"
        >
          <n-form-item label="拒绝原因" path="rejection_reason">
            <n-input
              v-model:value="batchAuditForm.rejection_reason"
              type="textarea"
              :rows="3"
              placeholder="请输入拒绝原因"
            />
          </n-form-item>
        </n-form>
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showBatchAuditModal = false">取消</n-button>
          <n-button
            type="primary"
            :loading="batchAuditLoading"
            @click="handleBatchAuditSubmit"
          >
            确定
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue'
import {
  NCard,
  NGrid,
  NGridItem,
  NStatistic,
  NText,
  NSpace,
  NForm,
  NFormItem,
  NFormItemGi,
  NInput,
  NSelect,
  NDatePicker,
  NButton,
  NIcon,
  NDataTable,
  NModal,
  NTabs,
  NTabPane,
  NDescriptions,
  NDescriptionsItem,
  NAvatar,
  NTag,
  NImage,
  NEmpty,
  NDivider,
  NRadioGroup,
  NRadio,
  useMessage,
  type DataTableColumns,
} from 'naive-ui'
import { Search, Refresh, CheckCircle, CloseCircle, Eye } from '@vicons/ionicons5'
import {
  getFeederAuditList,
  getFeederDetail,
  auditFeeder,
  batchUpdateFeeders,
  type FeederInfo,
  type FeederListParams,
  type FeederAuditData,
} from '@/api/feeder'
import { useUserStore } from '@/store/modules/user'
import { formatDate } from '@/utils'

// 权限控制
const userStore = useUserStore()
const hasPermission = (permission: string) => {
  const permissions = userStore.getUserInfo.permissions || []
  return permissions.includes(permission) || userStore.getUserInfo.roles?.includes('super')
}

// 响应式数据
const loading = ref(false)
const auditLoading = ref(false)
const batchAuditLoading = ref(false)
const tableData = ref<FeederInfo[]>([])
const currentFeeder = ref<FeederInfo | null>(null)
const showAuditModal = ref(false)
const showBatchAuditModal = ref(false)
const selectedRowKeys = ref<number[]>([])
const batchAction = ref<'approve' | 'reject'>('approve')

// 统计数据
const stats = ref({
  pending: 0,
  todayAudit: 0,
  passRate: 0,
  avgAuditTime: 0,
})

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive<FeederListParams>({
  keyword: '',
  status: 0, // 默认显示待审核
  dateRange: null,
})

// 审核表单
const auditFormRef = ref()
const auditForm = reactive({
  action: 'approve' as 'approve' | 'reject',
  rejection_reason: '',
})

// 批量审核表单
const batchAuditFormRef = ref()
const batchAuditForm = reactive({
  rejection_reason: '',
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

// 审核状态选项
const auditStatusOptions = [
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '已拒绝', value: 2 },
]

// 默认图片
const defaultAvatar = 'https://via.placeholder.com/80x80?text=头像'
const defaultCertImage = 'https://via.placeholder.com/200x150?text=证书'

// 消息提示
const message = useMessage()

// 表格列配置
const columns: DataTableColumns<FeederInfo> = [
  {
    type: 'selection',
    disabled: (row) => row.status !== 0, // 只有待审核状态可选择
  },
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
    title: '姓名',
    key: 'name',
    width: 120,
  },
  {
    title: '手机号',
    key: 'phone',
    width: 140,
  },
  {
    title: '身份证号',
    key: 'id_card',
    width: 120,
    render(row) {
      return formatIdCard(row.id_card)
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
    title: '申请时间',
    key: 'created_at',
    width: 160,
    render(row) {
      return formatDate(row.created_at)
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
          { default: () => '查看详情', icon: () => h(NIcon, null, { default: () => h(Eye) }) }
        )
      )

      if (hasPermission('feeder:audit') && row.status === 0) {
        actions.push(
          h(
            NButton,
            {
              size: 'small',
              type: 'success',
              onClick: () => handleQuickAudit(row, 'approve'),
            },
            { default: () => '通过', icon: () => h(NIcon, null, { default: () => h(CheckCircle) }) }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleQuickAudit(row, 'reject'),
            },
            { default: () => '拒绝', icon: () => h(NIcon, null, { default: () => h(CloseCircle) }) }
          )
        )
      }

      return h(NSpace, { size: 'small' }, { default: () => actions })
    },
  },
]

// 工具函数
const getStatusType = (status: number) => {
  const types = { 0: 'warning', 1: 'success', 2: 'error' }
  return types[status] || 'default'
}

const getStatusText = (status: number) => {
  const texts = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
  return texts[status] || '未知'
}

const formatIdCard = (idCard?: string) => {
  if (!idCard) return '未填写'
  return idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '$1****$2')
}

// API调用
const fetchData = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm,
    }
    
    if (searchForm.dateRange) {
      params.dateRange = [
        new Date(searchForm.dateRange[0]).toISOString().split('T')[0],
        new Date(searchForm.dateRange[1]).toISOString().split('T')[0],
      ]
    }

    const response = await getFeederAuditList(params)
    tableData.value = response.data.list || []
    pagination.total = response.data.total || 0
    
    // 更新统计数据
    if (response.data.stats) {
      stats.value = response.data.stats
    }
  } catch (error) {
    message.error('获取审核列表失败')
    console.error('获取审核列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 事件处理
const handleSearch = () => {
  pagination.page = 1
  selectedRowKeys.value = []
  fetchData()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = 0
  searchForm.dateRange = null
  pagination.page = 1
  selectedRowKeys.value = []
  fetchData()
}

const handleRowKeysChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

const handleViewDetail = async (row: FeederInfo) => {
  try {
    const response = await getFeederDetail(row.id)
    currentFeeder.value = response.data
    // 重置审核表单
    auditForm.action = 'approve'
    auditForm.rejection_reason = ''
    showAuditModal.value = true
  } catch (error) {
    message.error('获取详情失败')
  }
}

const handleQuickAudit = (row: FeederInfo, action: 'approve' | 'reject') => {
  if (action === 'reject') {
    // 拒绝操作需要输入原因，打开详情弹窗
    handleViewDetail(row).then(() => {
      auditForm.action = 'reject'
    })
  } else {
    // 通过操作可以直接执行
    const dialog = window.$dialog.info({
      title: '确认审核',
      content: `确定要通过喂养员"${row.name}"的申请吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await auditFeeder({
            id: row.id,
            action: 'approve',
          })
          message.success('审核成功')
          fetchData()
        } catch (error) {
          message.error('审核失败')
        }
      },
    })
  }
}

const handleAuditSubmit = async () => {
  if (!currentFeeder.value) return
  
  if (auditForm.action === 'reject' && !auditForm.rejection_reason.trim()) {
    message.error('请输入拒绝原因')
    return
  }

  try {
    auditLoading.value = true
    await auditFeeder({
      id: currentFeeder.value.id,
      action: auditForm.action,
      rejection_reason: auditForm.rejection_reason,
    })
    message.success('审核成功')
    showAuditModal.value = false
    fetchData()
  } catch (error) {
    message.error('审核失败')
  } finally {
    auditLoading.value = false
  }
}

const handleBatchAudit = (action: 'approve' | 'reject') => {
  batchAction.value = action
  batchAuditForm.rejection_reason = ''
  showBatchAuditModal.value = true
}

const handleBatchAuditSubmit = async () => {
  if (batchAction.value === 'reject' && !batchAuditForm.rejection_reason.trim()) {
    message.error('请输入拒绝原因')
    return
  }

  try {
    batchAuditLoading.value = true
    await batchUpdateFeeders(selectedRowKeys.value, 'audit', {
      action: batchAction.value,
      rejection_reason: batchAuditForm.rejection_reason,
    })
    message.success('批量审核成功')
    showBatchAuditModal.value = false
    selectedRowKeys.value = []
    fetchData()
  } catch (error) {
    message.error('批量审核失败')
  } finally {
    batchAuditLoading.value = false
  }
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.feeder-audit {
  padding: 16px;
}

.search-form {
  margin-bottom: 16px;
}

.audit-detail {
  max-height: 600px;
  overflow-y: auto;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>