<template>
  <n-card>
    <n-data-table :columns="columns" :data="list" :pagination="pagination" @update:page="onPage" @update:page-size="onPageSize" />
  </n-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { getFeedbackList } from '@/api/pet/feedback'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const columns = [
  { title: '投诉人昵称', key: 'user_name' },
  { title: '内容', key: 'content' },
  { title: '状态', key: 'status' }
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
  const res = await getFeedbackList({ page: page.value })
  list.value = res.list || []
  total.value = res.itemCount || 0
}

function onPage(p:number) { page.value = p; fetchList() }
function onPageSize(s:number) { pageSize.value = s; fetchList() }

fetchList()
</script>
