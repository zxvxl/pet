<!-- frontend/admin/src/views/feeders/FeederList.vue -->
<template>
  <div class="feeder-list">
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
                placeholder="搜索姓名/手机号"
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
        <n-space v-if="hasPermission('feeder:create')">
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            新增喂养员
          </n-button>
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

    <!-- 详情弹窗 -->
    <n-modal
      v-model:show="showDetailModal"
      :mask-closable="false"
      preset="card"
      title="喂养员详情"
      style="width: 800px"
    >
      <div v-if="currentFeeder" class="feeder-detail">
        <n-descriptions
          :column="2"
          bordered
          label-placement="left"
          label-style="width: 120px"
        >
          <n-descriptions-item label="头像">
            <n-avatar
              :src="currentFeeder.avatar"
              :size="60"
              round
              :fallback-src="defaultAvatar"
            />
          </n-descriptions-item>
          <n-descriptions-item label="姓名">{{ currentFeeder.name }}</n-descriptions-item>
          <n-descriptions-item label="手机号">{{ currentFeeder.phone }}</n-descriptions-item>
          <n-descriptions-item label="身份证号">
            {{ formatIdCard(currentFeeder.id_card) }}
          </n-descriptions-item>
          <n-descriptions-item label="状态">
            <n-tag :type="getStatusType(currentFeeder.status)" size="small">
              {{ getStatusText(currentFeeder.status) }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item label="评分">
            <n-rate
              :value="currentFeeder.rating || 5"
              readonly
              size="small"
              style="--n-item-size: 16px"
            />
            <span class="ml-2">{{ currentFeeder.rating || 5.0 }}</span>
          </n-descriptions-item>
          <n-descriptions-item label="完成订单">{{ currentFeeder.order_count || 0 }}单</n-descriptions-item>
          <n-descriptions-item label="注册时间">{{ formatDate(currentFeeder.created_at) }}</n-descriptions-item>
          <n-descriptions-item label="最后登录">{{ formatDate(currentFeeder.last_login_at) }}</n-descriptions-item>
          <n-descriptions-item label="地址" :span="2">{{ currentFeeder.address || '暂无' }}</n-descriptions-item>
          <n-descriptions-item label="个人简介" :span="2">{{ currentFeeder.bio || '暂无' }}</n-descriptions-item>
          <n-descriptions-item label="工作经验" :span="2">{{ currentFeeder.experience || '暂无' }}</n-descriptions-item>
          <n-descriptions-item v-if="currentFeeder.rejection_reason" label="拒绝原因" :span="2">
            <n-text type="error">{{ currentFeeder.rejection_reason }}</n-text>
          </n-descriptions-item>
        </n-descriptions>

        <!-- 资质证书 -->
        <n-divider />
        <h4>资质证书</h4>
        <n-grid v-if="currentFeeder.certificates && currentFeeder.certificates.length" :cols="3" :x-gap="12" :y-gap="12">
          <n-grid-item v-for="(cert, index) in currentFeeder.certificates" :key="index">
            <n-image
              :src="cert"
              width="100"
              height="100"
              object-fit="cover"
              :fallback-src="defaultCertImage"
            />
          </n-grid-item>
        </n-grid>
        <n-empty v-else description="暂无证书" size="small" />
      </div>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showDetailModal = false">关闭</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 编辑弹窗 -->
    <n-modal
      v-model:show="showEditModal"
      :mask-closable="false"
      preset="card"
      :title="editForm.id ? '编辑喂养员' : '新增喂养员'"
      style="width: 600px"
    >
      <n-form
        ref="editFormRef"
        :model="editForm"
        :rules="editRules"
        label-placement="left"
        label-width="80px"
      >
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="editForm.name" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="editForm.phone" placeholder="请输入手机号" />
        </n-form-item>
        <n-form-item label="身份证号" path="id_card">
          <n-input v-model:value="editForm.id_card" placeholder="请输入身份证号" />
        </n-form-item>
        <n-form-item label="地址" path="address">
          <n-input v-model:value="editForm.address" placeholder="请输入地址" />
        </n-form-item>
        <n-form-item label="个人简介" path="bio">
          <n-input
            v-model:value="editForm.bio"
            type="textarea"
            :rows="3"
            placeholder="请输入个人简介"
          />
        </n-form-item>
        <n-form-item label="工作经验" path="experience">
          <n-input
            v-model:value="editForm.experience"
            type="textarea"
            :rows="3"
            placeholder="请输入工作经验"
          />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-select
            v-model:value="editForm.status"
            :options="statusOptions"
            placeholder="选择状态"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" :loading="submitLoading" @click="handleSubmit">
            确定
          </n-button>
        </n-space>
      </template>
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
  NRate,
  NText,
  NDivider,
  NImage,
  NGridItem,
  NEmpty,
  useMessage,
  type DataTableColumns,
  type FormRules,
} from 'naive-ui'
import { Search, Refresh, Add, Download, Eye, Edit, Trash, CheckCircle, CloseCircle } from '@vicons/ionicons5'
import {
  getFeederList,
  getFeederDetail,
  createFeeder,
  updateFeeder,
  deleteFeeder,
  updateFeederStatus,
  exportFeeders,
  type FeederInfo,
  type FeederListParams,
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
const exportLoading = ref(false)
const submitLoading = ref(false)
const tableData = ref<FeederInfo[]>([])
const currentFeeder = ref<FeederInfo | null>(null)
const showDetailModal = ref(false)
const showEditModal = ref(false)

// 搜索表单
const searchFormRef = ref()
const searchForm = reactive<FeederListParams>({
  keyword: '',
  status: null,
  dateRange: null,
})

// 编辑表单
const editFormRef = ref()
const editForm = reactive<Partial<FeederInfo>>({
  id: undefined,
  name: '',
  phone: '',
  id_card: '',
  address: '',
  bio: '',
  experience: '',
  status: 0,
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
  { label: '待审核', value: 0 },
  { label: '已通过', value: 1 },
  { label: '已拒绝', value: 2 },
  { label: '已禁用', value: 3 },
]

// 表单验证规则
const editRules: FormRules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' },
  phone: {
    required: true,
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号',
    trigger: 'blur',
  },
  id_card: {
    pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    message: '请输入正确的身份证号',
    trigger: 'blur',
  },
}

// 默认图片
const defaultAvatar = 'https://via.placeholder.com/60x60?text=头像'
const defaultCertImage = 'https://via.placeholder.com/100x100?text=证书'

// 消息提示
const message = useMessage()

// 表格列配置
const columns: DataTableColumns<FeederInfo> = [
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
    title: '评分',
    key: 'rating',
    width: 120,
    render(row) {
      return h(
        NSpace,
        { size: 'small', align: 'center' },
        {
          default: () => [
            h(NRate, {
              value: row.rating || 5,
              readonly: true,
              size: 'small',
              style: '--n-item-size: 14px',
            }),
            h('span', {}, (row.rating || 5.0).toFixed(1)),
          ],
        }
      )
    },
  },
  {
    title: '完成订单',
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

      if (hasPermission('feeder:edit')) {
        actions.push(
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => handleEdit(row),
            },
            { default: () => '编辑', icon: () => h(NIcon, null, { default: () => h(Edit) }) }
          )
        )
      }

      if (hasPermission('feeder:manage')) {
        if (row.status === 1) {
          actions.push(
            h(
              NButton,
              {
                size: 'small',
                type: 'warning',
                onClick: () => handleStatusChange(row, 3),
              },
              { default: () => '禁用', icon: () => h(NIcon, null, { default: () => h(CloseCircle) }) }
            )
          )
        } else if (row.status === 3) {
          actions.push(
            h(
              NButton,
              {
                size: 'small',
                type: 'success',
                onClick: () => handleStatusChange(row, 1),
              },
              { default: () => '启用', icon: () => h(NIcon, null, { default: () => h(CheckCircle) }) }
            )
          )
        }
      }

      if (hasPermission('feeder:delete')) {
        actions.push(
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleDelete(row),
            },
            { default: () => '删除', icon: () => h(NIcon, null, { default: () => h(Trash) }) }
          )
        )
      }

      return h(NSpace, { size: 'small' }, { default: () => actions })
    },
  },
]

// 工具函数
const getStatusType = (status: number) => {
  const types = { 0: 'warning', 1: 'success', 2: 'error', 3: 'default' }
  return types[status] || 'default'
}

const getStatusText = (status: number) => {
  const texts = { 0: '待审核', 1: '已通过', 2: '已拒绝', 3: '已禁用' }
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

    const response = await getFeederList(params)
    tableData.value = response.data.list || []
    pagination.total = response.data.total || 0
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
  searchForm.dateRange = null
  pagination.page = 1
  fetchData()
}

const handleAdd = () => {
  resetEditForm()
  showEditModal.value = true
}

const handleEdit = (row: FeederInfo) => {
  Object.assign(editForm, row)
  showEditModal.value = true
}

const handleViewDetail = async (row: FeederInfo) => {
  try {
    const response = await getFeederDetail(row.id)
    currentFeeder.value = response.data
    showDetailModal.value = true
  } catch (error) {
    message.error('获取喂养员详情失败')
  }
}

const handleStatusChange = async (row: FeederInfo, status: number) => {
  try {
    await updateFeederStatus(row.id, status)
    message.success('状态更新成功')
    fetchData()
  } catch (error) {
    message.error('状态更新失败')
  }
}

const handleDelete = (row: FeederInfo) => {
  const dialog = window.$dialog.warning({
    title: '确认删除',
    content: `确定要删除喂养员"${row.name}"吗？此操作不可恢复。`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await deleteFeeder(row.id)
        message.success('删除成功')
        fetchData()
      } catch (error) {
        message.error('删除失败')
      }
    },
  })
}

const handleSubmit = async () => {
  try {
    await editFormRef.value?.validate()
    submitLoading.value = true

    if (editForm.id) {
      await updateFeeder(editForm.id, editForm)
      message.success('更新成功')
    } else {
      await createFeeder(editForm)
      message.success('创建成功')
    }

    showEditModal.value = false
    fetchData()
  } catch (error) {
    if (error?.message !== 'Validation failed') {
      message.error(editForm.id ? '更新失败' : '创建失败')
    }
  } finally {
    submitLoading.value = false
  }
}

const handleExport = async () => {
  try {
    exportLoading.value = true
    const response = await exportFeeders(searchForm)
    // 处理文件下载
    const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `喂养员列表_${new Date().toISOString().split('T')[0]}.xlsx`
    a.click()
    window.URL.revokeObjectURL(url)
    message.success('导出成功')
  } catch (error) {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

const resetEditForm = () => {
  Object.assign(editForm, {
    id: undefined,
    name: '',
    phone: '',
    id_card: '',
    address: '',
    bio: '',
    experience: '',
    status: 0,
  })
  editFormRef.value?.restoreValidation()
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.feeder-list {
  padding: 16px;
}

.search-form {
  margin-bottom: 16px;
}

.feeder-detail {
  max-height: 600px;
  overflow-y: auto;
}

.ml-2 {
  margin-left: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>