<script setup>
import { ref, onMounted, h } from 'vue'
import { baseUrl } from '../config'

const records = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)

const fetchData = async () => {
  const params = new URLSearchParams({ page: page.value, pageSize: pageSize.value })
  const res = await fetch(`${baseUrl}/admin/finance?${params}`)
  const json = await res.json()
  records.value = json.data || []
  total.value = json.total || 0
}

const exportData = () => {
  window.open(baseUrl + '/admin/finance/export')
}

const columns = [
  { title: '喂养员', key: 'feederName' },
  { title: '金额', key: 'amount' },
  { title: '提现记录', key: 'withdraw' },
  { title: '结算时间', key: 'settledAt', sorter: 'default' }
]

onMounted(fetchData)
</script>

<template>
  <div>
    <n-space style="margin-bottom: 12px">
      <n-button type="primary" @click="exportData">导出数据</n-button>
    </n-space>
    <n-data-table :columns="columns" :data="records" :pagination="{ page: page, pageSize: pageSize, itemCount: total }" @update:page="v => { page = v; fetchData() }" @update:page-size="v => { pageSize = v; fetchData() }" />
  </div>
</template>
