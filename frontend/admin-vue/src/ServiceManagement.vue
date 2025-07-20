<script setup>
import { ref, onMounted, h } from 'vue'
import { baseUrl } from '../config'

const services = ref([])
const dialogVisible = ref(false)
const form = ref({ id: null, name: '', price: 0, description: '', validity: '' })

const fetchServices = async () => {
  const res = await fetch(baseUrl + '/admin/services')
  const json = await res.json()
  services.value = json.data || []
}

const showAdd = () => {
  form.value = { id: null, name: '', price: 0, description: '', validity: '' }
  dialogVisible.value = true
}
const edit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}
const save = async () => {
  const method = form.value.id ? 'PUT' : 'POST'
  await fetch(baseUrl + '/admin/services' + (form.value.id ? '/' + form.value.id : ''), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  dialogVisible.value = false
  fetchServices()
}
const remove = async (id) => {
  await fetch(baseUrl + '/admin/services/' + id, { method: 'DELETE' })
  fetchServices()
}

const columns = [
  { title: '名称', key: 'name' },
  { title: '价格', key: 'price' },
  { title: '描述', key: 'description' },
  { title: '有效期', key: 'validity' },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return [
        h('n-button', { size: 'small', onClick: () => edit(row) }, '编辑'),
        h('n-button', { size: 'small', type: 'error', onClick: () => remove(row.id) }, '删除')
      ]
    }
  }
]

onMounted(fetchServices)
</script>

<template>
  <div>
    <n-space style="margin-bottom: 12px">
      <n-button type="primary" @click="showAdd">添加服务</n-button>
    </n-space>
    <n-data-table :columns="columns" :data="services" />
    <n-modal v-model:show="dialogVisible" title="服务项">
      <n-form :model="form">
        <n-form-item label="名称">
          <n-input v-model:value="form.name" />
        </n-form-item>
        <n-form-item label="价格">
          <n-input-number v-model:value="form.price" />
        </n-form-item>
        <n-form-item label="描述">
          <n-input v-model:value="form.description" />
        </n-form-item>
        <n-form-item label="有效期">
          <n-input v-model:value="form.validity" />
        </n-form-item>
      </n-form>
      <n-button type="primary" @click="save">保存</n-button>
    </n-modal>
  </div>
</template>
