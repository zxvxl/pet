<template>
  <div class="permission-container">
    <n-card title="权限管理" :bordered="false">
      <!-- 操作栏 -->
      <div class="action-bar">
        <n-space>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            新增权限
          </n-button>
          <n-button @click="handleRefresh">
            <template #icon>
              <n-icon><Refresh /></n-icon>
            </template>
            刷新
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

    <!-- 新增/编辑弹窗 -->
    <n-modal v-model:show="showModal" preset="card" :title="modalTitle" style="width: 600px">
      <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="100px">
        <n-form-item label="权限名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入权限名称" />
        </n-form-item>
        <n-form-item label="权限编码" path="code">
          <n-input v-model:value="formData.code" placeholder="请输入权限编码" />
        </n-form-item>
        <n-form-item label="权限类型" path="type">
          <n-select v-model:value="formData.type" :options="typeOptions" placeholder="请选择权限类型" />
        </n-form-item>
        <n-form-item label="权限描述" path="description">
          <n-input v-model:value="formData.description" type="textarea" placeholder="请输入权限描述" />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleSubmit" :loading="submitting">确定</n-button>
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
  NModal, 
  NForm, 
  NFormItem, 
  NInput, 
  NSelect, 
  NIcon,
  NTag,
  useMessage,
  type DataTableColumns,
  type FormInst
} from 'naive-ui'
import { Add, Refresh, Edit, Trash } from '@vicons/ionicons5'

// 类型定义
interface Permission {
  id: number
  name: string
  code: string
  type: string
  description: string
  created_at: string
}

interface FormData {
  id?: number
  name: string
  code: string
  type: string
  description: string
}

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<Permission[]>([])
const showModal = ref(false)
const formRef = ref<FormInst | null>(null)

const formData = reactive<FormData>({
  name: '',
  code: '',
  type: '',
  description: ''
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
  { label: '菜单权限', value: 'menu' },
  { label: '操作权限', value: 'action' },
  { label: '数据权限', value: 'data' }
]

// 表单验证规则
const rules = {
  name: {
    required: true,
    message: '请输入权限名称',
    trigger: 'blur'
  },
  code: {
    required: true,
    message: '请输入权限编码',
    trigger: 'blur'
  },
  type: {
    required: true,
    message: '请选择权限类型',
    trigger: 'change'
  }
}

// 消息提示
const message = useMessage()

// 计算属性
const modalTitle = computed(() => formData.id ? '编辑权限' : '新增权限')

// 表格列配置
const columns: DataTableColumns<Permission> = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '权限名称',
    key: 'name',
    width: 150
  },
  {
    title: '权限编码',
    key: 'code',
    width: 200
  },
  {
    title: '权限类型',
    key: 'type',
    width: 120,
    render(row) {
      const typeMap = {
        menu: { text: '菜单权限', type: 'success' },
        action: { text: '操作权限', type: 'info' },
        data: { text: '数据权限', type: 'warning' }
      }
      const config = typeMap[row.type as keyof typeof typeMap] || { text: row.type, type: 'default' }
      return h(NTag, {
        type: config.type,
        size: 'small'
      }, { default: () => config.text })
    }
  },
  {
    title: '描述',
    key: 'description',
    width: 200
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 160,
    render(row) {
      return formatDate(row.created_at)
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render(row) {
      return h(NSpace, { size: 'small' }, {
        default: () => [
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
    const mockData: Permission[] = [
      {
        id: 1,
        name: '用户管理',
        code: 'user:manage',
        type: 'menu',
        description: '用户管理模块的访问权限',
        created_at: '2024-01-01 00:00:00'
      },
      {
        id: 2,
        name: '订单查看',
        code: 'order:view',
        type: 'action',
        description: '查看订单的权限',
        created_at: '2024-01-01 00:00:00'
      },
      {
        id: 3,
        name: '金额查看',
        code: 'amount:view',
        type: 'data',
        description: '查看订单金额的权限',
        created_at: '2024-01-01 00:00:00'
      }
    ]
    
    tableData.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    message.error('获取权限列表失败')
    console.error('获取权限列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 事件处理
const handleAdd = () => {
  formData.id = undefined
  formData.name = ''
  formData.code = ''
  formData.type = ''
  formData.description = ''
  showModal.value = true
}

const handleEdit = (row: Permission) => {
  formData.id = row.id
  formData.name = row.name
  formData.code = row.code
  formData.type = row.type
  formData.description = row.description
  showModal.value = true
}

const handleDelete = async (row: Permission) => {
  try {
    await window.$dialog.warning({
      title: '确认删除',
      content: `确定要删除权限"${row.name}"吗？`,
      positiveText: '确定',
      negativeText: '取消'
    })
    
    message.success('删除成功')
    fetchData()
  } catch (error) {
    // 用户取消删除
  }
}

const handleRefresh = () => {
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

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    
    submitting.value = true
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success(formData.id ? '更新成功' : '创建成功')
    showModal.value = false
    fetchData()
  } catch (error) {
    if (error !== false) {
      message.error('操作失败')
      console.error('操作失败:', error)
    }
  } finally {
    submitting.value = false
  }
}

// 生命周期
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.permission-container {
  padding: 20px;
}

.action-bar {
  margin-bottom: 16px;
}
</style> 