<script setup>
import { ref, h, onMounted } from 'vue'
import { baseUrl } from '../config'

const query = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const users = ref([])

const columns = [
  { title: 'ID', key: 'id', sorter: 'default' },
  { title: '用户名', key: 'username' },
  { title: '手机号', key: 'phone' },
  { title: '注册时间', key: 'createdAt', sorter: 'default' },
  { title: '状态', key: 'status' },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return [
        h('n-button', { size: 'small', onClick: () => freeze(row.id) }, '冻结'),
        h('n-button', { size: 'small', type: 'error', onClick: () => remove(row.id) }, '删除')
      ]
    }
  }
]

const fetchUsers = async () => {
  const params = new URLSearchParams({ page: page.value, pageSize: pageSize.value, q: query.value })
  const res = await fetch(`${baseUrl}/admin/users?${params}`)
  const json = await res.json()
  users.value = json.data || []
  total.value = json.total || 0
}

const freeze = async (id) => {
  await fetch(`${baseUrl}/admin/users/${id}/freeze`, { method: 'PATCH' })
  fetchUsers()
}
const remove = async (id) => {
  await fetch(`${baseUrl}/admin/users/${id}`, { method: 'DELETE' })
  fetchUsers()
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <n-space style="margin-bottom: 12px">
      <n-input v-model:value="query" placeholder="搜索用户名" style="width: 200px" />
      <n-button type="primary" @click="fetchUsers">搜索</n-button>
    </n-space>
    <n-data-table :columns="columns" :data="users" :pagination="{ page: page, pageSize: pageSize, itemCount: total }" @update:page="v => { page = v; fetchUsers() }" @update:page-size="v => { pageSize = v; fetchUsers() }" />
  </div>
</template>
