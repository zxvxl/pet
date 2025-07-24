<template>
  <div class="admin-users">
    <n-card title="管理员账户管理" class="mb-4">
      <template #header-extra>
        <n-button type="primary" @click="handleAdd">新增管理员</n-button>
      </template>
      
      <n-data-table
        :columns="columns"
        :data="userData"
        :loading="loading"
        :pagination="pagination"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </n-card>

    <!-- 新增/编辑模态框 -->
    <n-modal
      v-model:show="showModal"
      :title="modalTitle"
      preset="dialog"
      :loading="modalLoading"
      @positive-click="handleSubmit"
      @negative-click="handleCancel"
    >
      <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        label-width="80"
        class="mt-4"
      >
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            :disabled="isEdit"
          />
        </n-form-item>
        
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </n-form-item>
        
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </n-form-item>
        
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="formData.phone" placeholder="请输入手机号" />
        </n-form-item>
        
        <n-form-item label="角色" path="roles">
          <n-select
            v-model:value="formData.roles"
            multiple
            :options="roleOptions"
            placeholder="请选择角色"
          />
        </n-form-item>
        
        <n-form-item v-if="!isEdit" label="密码" path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="mousedown"
          />
        </n-form-item>
      </n-form>
    </n-modal>

    <!-- 删除确认框 -->
    <n-modal
      v-model:show="showDeleteModal"
      preset="dialog"
      type="warning"
      title="确认删除"
      content="确定要删除该管理员账户吗？此操作不可恢复。"
      positive-text="确认删除"
      negative-text="取消"
      @positive-click="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, computed } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import type { FormRules } from 'naive-ui'
import { getAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, getAdminRoles } from '@/api/admin/user'
import type { DataTableColumns } from 'naive-ui'

interface AdminUser {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  is_active: boolean
  created_at: string
  roles: Array<{
    id: number
    name: string
    code: string
  }>
}

interface Role {
  id: number
  name: string
  code: string
}

// 表格列定义
const columns: DataTableColumns<AdminUser> = [
  {
    title: '用户名',
    key: 'username',
    width: 120
  },
  {
    title: '角色',
    key: 'roles',
    width: 200,
    render: (row) => {
      return h('div', [
        ...row.roles.map(role => 
          h('n-tag', { 
            type: 'info', 
            size: 'small',
            style: 'margin-right: 4px'
          }, { default: () => role.name })
        )
      ])
    }
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 180,
    render: (row) => {
      return new Date(row.created_at).toLocaleString()
    }
  },
  {
    title: '状态',
    key: 'is_active',
    width: 80,
    render: (row) => {
      return h('n-tag', { 
        type: row.is_active ? 'success' : 'error' 
      }, { default: () => row.is_active ? '启用' : '禁用' })
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    render: (row) => {
      return h('div', [
        h('n-button', { 
          size: 'small', 
          type: 'primary',
          onClick: () => handleEdit(row)
        }, { default: () => '编辑' }),
        h('n-button', { 
          size: 'small', 
          type: 'error',
          style: 'margin-left: 8px',
          onClick: () => handleDelete(row)
        }, { default: () => '删除' })
      ])
    }
  }
]

// 响应式数据
const userData = ref<AdminUser[]>([])
const roleOptions = ref<Array<{ label: string, value: number }>>([])
const loading = ref(false)
const modalLoading = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEdit = ref(false)
const currentId = ref<number | null>(null)

// 表单相关
const formRef = ref()
const formData = reactive({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  roles: [] as number[],
  password: ''
})

const formRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  roles: [
    { type: 'array', required: true, message: '请选择角色', trigger: 'change' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
})

// 计算属性
const modalTitle = computed(() => isEdit.value ? '编辑管理员' : '新增管理员')

// 消息和对话框
const message = useMessage()
const dialog = useDialog()

// 获取用户列表
const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await getAdminUsers({
      page: pagination.page,
      limit: pagination.pageSize
    })
    userData.value = response.data || []
    pagination.itemCount = response.total || 0
  } catch (error: any) {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const fetchRoles = async () => {
  try {
    const response = await getAdminRoles()
    roleOptions.value = (response.data || []).map((role: Role) => ({
      label: role.name,
      value: role.id
    }))
  } catch (error: any) {
    message.error('获取角色列表失败')
  }
}

// 新增操作
const handleAdd = () => {
  isEdit.value = false
  currentId.value = null
  resetForm()
  showModal.value = true
}

// 编辑操作
const handleEdit = (row: AdminUser) => {
  isEdit.value = true
  currentId.value = row.id
  formData.username = row.username
  formData.nickname = row.nickname
  formData.email = row.email
  formData.phone = row.phone
  formData.roles = row.roles.map(role => role.id)
  formData.password = ''
  showModal.value = true
}

// 删除操作
const handleDelete = (row: AdminUser) => {
  currentId.value = row.id
  showDeleteModal.value = true
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true
    
    const payload = isEdit.value 
      ? {
          nickname: formData.nickname,
          email: formData.email,
          phone: formData.phone,
          roles: formData.roles
        }
      : {
          username: formData.username,
          nickname: formData.nickname,
          email: formData.email,
          phone: formData.phone,
          roles: formData.roles,
          password: formData.password
        }

    if (isEdit.value && currentId.value) {
      await updateAdminUser(currentId.value, payload)
      message.success('更新成功')
    } else {
      await createAdminUser(payload)
      message.success('新增成功')
    }
    
    showModal.value = false
    fetchUsers()
  } catch (error: any) {
    const errorMessage = error?.message || (isEdit.value ? '更新失败' : '新增失败')
    message.error(errorMessage)
  } finally {
    modalLoading.value = false
  }
}

// 确认删除
const handleDeleteConfirm = async () => {
  if (!currentId.value) return
  
  try {
    await deleteAdminUser(currentId.value)
    message.success('删除成功')
    showDeleteModal.value = false
    fetchUsers()
  } catch (error) {
    message.error('删除失败')
  }
}

// 取消操作
const handleCancel = () => {
  showModal.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formData.username = ''
  formData.nickname = ''
  formData.email = ''
  formData.phone = ''
  formData.roles = []
  formData.password = ''
  formRef.value?.restoreValidation()
}

// 分页处理
const handlePageChange = (page: number) => {
  pagination.page = page
  fetchUsers()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  fetchUsers()
}

// 初始化
onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>

<style scoped>
.admin-users {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}

.mt-4 {
  margin-top: 16px;
}
</style>