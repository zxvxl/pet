<template>
  <n-card>
    <n-data-table :columns="columns" :data="list" :pagination="pagination" @update:page="onPage" @update:page-size="onPageSize" />
  </n-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch, h, resolveDirective, withDirectives } from 'vue'
import { getFeederPending, approveFeeder } from '@/api/feeder'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const columns = [
  { title: '姓名', key: 'name' },
  // backend uses `phone` field
  { title: '电话', key: 'phone' },
  { title: '状态', key: 'status' },
  {
    title: '操作',
    key: 'actions',
    render(row:any){
      const directive = resolveDirective('permission')
      const button = h('n-button',{size:'small',type:'primary',onClick:()=>approve(row)},'审核')
      return withDirectives(button, [[directive as any, 'feeder:approve']])
    }
  }
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
  const res = await getFeederPending({ page: page.value, status: 0 })
  list.value = res.list || []
  total.value = res.itemCount || 0
}

async function approve(row:any){
  await approveFeeder({ feeder_id: row.id, approve: true })
  fetchList()
}

function onPage(p:number) { page.value = p; fetchList() }
function onPageSize(s:number) { pageSize.value = s; fetchList() }

fetchList()
</script>
