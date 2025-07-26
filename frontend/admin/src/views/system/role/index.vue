<template>
  <div class="role-container">
    <n-card title="角色管理" :bordered="false">
      <!-- 操作栏 -->
      <div class="action-bar">
        <n-space>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon><Add /></n-icon>
            </template>
            新增角色
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
        <n-form-item label="角色名称" path="name">
          <n-input v-model:value="formData.name" placeholder="请输入角色名称" />
        </n-form-item>
        <n-form-item label="角色编码" path="code">
          <n-input v-model:value="formData.code" placeholder="请输入角色编码" />
        </n-form-item>
        <n-form-item label="角色描述" path="description">
          <n-input v-model:value="formData.description" type="textarea" placeholder="请输入角色描述" />
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-switch v-model:value="formData.status" />
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
  NSwitch, 
  NIcon,
  NTag,
  useMessage,
  type DataTableColumns,
  type FormInst
} from 'naive-ui'
import { Add, Refresh, Edit, Trash, Eye } from '@vicons/ionicons5'

// 类型定义
interface Role {
  id: number
  name: string
  code: string
  description: string
  status: boolean
  created_at: string
  updated_at: string
}

interface FormData {
  id?: number
  name: string
  code: string
  description: string
  status: boolean
}

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const tableData = ref<Role[]>([])
const showModal = ref(false)
const formRef = ref<FormInst | null>(null)

const formData = reactive<FormData>({
  name: '',
  code: '',
  description: '',
  status: true
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

// 表单验证规则
const rules = {
  name: {
    required: true,
    message: '请输入角色名称',
    trigger: 'blur'
  },
  code: {
    required: true,
    message: '请输入角色编码',
    trigger: 'blur'
  }
}

// 消息提示
const message = useMessage()

// 计算属性
const modalTitle = computed(() => formData.id ? '编辑角色' : '新增角色')

// 表格列配置
const columns: DataTableColumns<Role> = [
  {
    title: 'ID',
    key: 'id',
    width: 80
  },
  {
    title: '角色名称',
    key: 'name',
    width: 150
  },
  {
    title: '角色编码',
    key: 'code',
    width: 150
  },
  {
    title: '描述',
    key: 'description',
    width: 200
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(NTag, {
        type: row.status ? 'success' : 'error',
        size: 'small'
      }, { default: () => row.status ? '启用' : '禁用' })
    }
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
    width: 200,
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
            type: 'info',
            onClick: () => handleView(row)
          }, { default: () => '查看' }),
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
    const mockData: Role[] = [
      {
        id: 1,
        name: '超级管理员',
        code: 'super_admin',
        description: '系统超级管理员，拥有所有权限',
        status: true,
        created_at: '2024-01-01 00:00:00',
        updated_at: '2024-01-01 00:00:00'
      },
      {
        id: 2,
        name: '普通管理员',
        code: 'admin',
        description: '普通管理员，拥有部分权限',
        status: true,
        created_at: '2024-01-01 00:00:00',
        updated_at: '2024-01-01 00:00:00'
      }
    ]
    
    tableData.value = mockData
    pagination.total = mockData.length
  } catch (error) {
    message.error('获取角色列表失败')
    console.error('获取角色列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 事件处理
const handleAdd = () => {
  formData.id = undefined
  formData.name = ''
  formData.code = ''
  formData.description = ''
  formData.status = true
  showModal.value = true
}

const handleEdit = (row: Role) => {
  formData.id = row.id
  formData.name = row.name
  formData.code = row.code
  formData.description = row.description
  formData.status = row.status
  showModal.value = true
}

const handleView = (row: Role) => {
  message.info('查看功能开发中...')
}

const handleDelete = async (row: Role) => {
  try {
    await window.$dialog.warning({
      title: '确认删除',
      content: `确定要删除角色"${row.name}"吗？`,
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
.role-container {
  padding: 20px;
}

.action-bar {
  margin-bottom: 16px;
}
</style> 