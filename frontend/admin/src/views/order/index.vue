<template>
  <n-card>
    <n-space>
      <n-select v-model:value="status" :options="statusOptions" placeholder="状态" style="width: 120px" />
      <n-date-picker v-model:value="range" type="daterange" />
      <n-button type="primary" @click="fetchList">筛选</n-button>
    </n-space>
    <n-data-table :columns="columns" :data="list" :pagination="pagination" @update:page="onPage" @update:page-size="onPageSize" />
  </n-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { getOrderList } from '@/api/order'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const status = ref('')
const range = ref(null)

const statusOptions = [
  { label: '全部', value: '' },
  { label: '待处理', value: 'pending' },
  { label: '完成', value: 'finished' }
]

const columns = [
  { title: '订单号', key: 'id' },
  {
    title: '下单用户',
    key: 'user',
    render(row: any) {
      return row.user?.nickname
    }
  },
  { title: '订单状态', key: 'status' },
  { title: '下单时间', key: 'start_time' }
]

const pagination = reactive({
  page: page.value,
  pageSize: pageSize.value,
  itemCount: total.value
})

watch([page, pageSize, total], () => {
  pagination.page = page.value
  pagination.pageSize = pageSize.value
  pagination.itemCount = total.value
})

async function fetchList() {
  const res = await getOrderList({ page: page.value, status: status.value, date_range: range.value })
  list.value = res.list || []
  total.value = res.itemCount || 0
}

function onPage(p:number) { page.value = p; fetchList() }
function onPageSize(s:number) { pageSize.value = s; fetchList() }

fetchList()
</script>
