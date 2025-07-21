<template>
  <n-card>
    <n-space>
      <n-button type="primary" @click="showAdd = true" v-permission="'service:create'">新增服务</n-button>
    </n-space>
    <n-data-table :columns="columns" :data="list" :pagination="pagination" @update:page="onPage" @update:page-size="onPageSize" />
    <n-modal v-model:show="showAdd" title="新增服务">
      <n-form :model="form">
        <n-form-item label="服务名">
          <n-input v-model:value="form.service_name" />
        </n-form-item>
        <n-form-item label="单价">
          <n-input-number v-model:value="form.price" />
        </n-form-item>
        <n-form-item label="时长">
          <n-input-number v-model:value="form.duration" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showAdd=false">取消</n-button>
        <n-button type="primary" @click="addService" v-permission="'service:create'">提交</n-button>
      </template>
    </n-modal>
  </n-card>
</template>
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { getServiceList, createService } from '@/api/service'

const list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showAdd = ref(false)
const form = reactive({ service_name: '', price: 0, duration: 0 })

const columns = [
  { title: '服务名', key: 'service_name' },
  { title: '单价', key: 'price' },
  { title: '时长', key: 'duration' }
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
  const res = await getServiceList({ page: page.value })
  list.value = res.list || []
  total.value = res.itemCount || 0
}

async function addService() {
  await createService(form)
  showAdd.value = false
  fetchList()
}

function onPage(p:number) { page.value = p; fetchList() }
function onPageSize(s:number) { pageSize.value = s; fetchList() }

fetchList()
</script>
