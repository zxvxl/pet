<template>
  <n-card>
    <n-space>
      <n-input v-model:value="keyword" placeholder="搜索宠物" style="width: 200px" />
      <n-button type="primary" @click="fetchList">搜索</n-button>
    </n-space>
    <n-data-table :columns="columns" :data="list" :pagination="pagination" @update:page="onPage" @update:page-size="onPageSize" />
  </n-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { getPetList } from '@/api/pet'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')

const columns = [
  { title: '宠物名', key: 'pet_name' },
  { title: '宠物种类', key: 'type' },
  { title: '主人昵称', key: 'owner_name' }
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
  const res = await getPetList({ page: page.value, page_size: pageSize.value, keyword: keyword.value })
  list.value = res.list || []
  total.value = res.itemCount || 0
}

function onPage(p:number) { page.value = p; fetchList() }
function onPageSize(s:number) { pageSize.value = s; fetchList() }

fetchList()
</script>
