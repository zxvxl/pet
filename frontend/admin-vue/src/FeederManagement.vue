<script setup>
import { ref, onMounted, h } from 'vue'
import { baseUrl } from '../config'

const query = ref('')
const feeders = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const columns = [
  { title: '姓名', key: 'name' },
  { title: '电话', key: 'phone' },
  { title: '入驻时间', key: 'createdAt', sorter: 'default' },
  { title: '审核状态', key: 'status' },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return [
        h('n-button', { size: 'small', type: 'success', onClick: () => approve(row.id) }, '通过'),
        h('n-button', { size: 'small', type: 'error', onClick: () => reject(row.id) }, '拒绝'),
        h('n-button', { size: 'small', onClick: () => view(row.id) }, '详情')
      ]
    }
  }
]

const fetchFeeders = async () => {
  const params = new URLSearchParams({ page: page.value, pageSize: pageSize.value, q: query.value })
  const res = await fetch(`${baseUrl}/admin/feeders?${params}`)
  const json = await res.json()
  feeders.value = json.data || []
  total.value = json.total || 0
}

const approve = async (id) => {
  await fetch(`${baseUrl}/admin/feeders/${id}/audit`, { method: 'PATCH', body: JSON.stringify({ approve: true }) })
  fetchFeeders()
}
const reject = async (id) => {
  await fetch(`${baseUrl}/admin/feeders/${id}/audit`, { method: 'PATCH', body: JSON.stringify({ approve: false }) })
  fetchFeeders()
}
const view = (id) => {
  console.log('view', id)
}

onMounted(fetchFeeders)
</script>

<template>
  <div>
    <n-space style="margin-bottom: 12px">
      <n-input v-model:value="query" placeholder="搜索姓名" style="width: 200px" />
      <n-button type="primary" @click="fetchFeeders">搜索</n-button>
    </n-space>
    <n-data-table :columns="columns" :data="feeders" :pagination="{ page: page, pageSize: pageSize, itemCount: total }" @update:page="v => { page = v; fetchFeeders() }" @update:page-size="v => { pageSize = v; fetchFeeders() }" />
  </div>
</template>
