<template>
  <n-card>
    <n-space>
      <n-input v-model:value="keyword" placeholder="搜索用户" style="width: 200px" />
      <n-button type="primary" @click="fetchList">搜索</n-button>
    </n-space>
    <n-data-table :columns="columns" :data="list" :pagination="pagination" @update:page="onPage" @update:page-size="onPageSize" />
  </n-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { getUserList } from '@/api/user'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')

const columns = [
  { title: '用户ID', key: 'user_id' },
  { title: '昵称', key: 'nickname' },
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
  const res = await getUserList({ page: page.value, page_size: pageSize.value, keyword: keyword.value })
  list.value = res.list || []
  total.value = res.itemCount || 0
}

function onPage(p:number) { page.value = p; fetchList() }
function onPageSize(s:number) { pageSize.value = s; fetchList() }

fetchList()
</script>
