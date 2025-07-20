<script setup>
import { ref, onMounted } from 'vue';
import { baseUrl } from '../config';
// Naive UI does not provide a built-in prompt dialog, use browser prompt
const feeders = ref([]);
const fetchFeeders = async () => {
  const res = await fetch(baseUrl + '/admin/feeders');
  const json = await res.json();
  feeders.value = json.data || [];
};
const audit = async (id, approve) => {
  let reason = '';
  if (!approve) {
    reason = window.prompt('请输入拒绝原因') || '';
    if (!reason) return;
  }
  await fetch(baseUrl + `/admin/feeders/${id}/audit`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ approve, reason }),
  });
  fetchFeeders();
};
onMounted(fetchFeeders);
</script>
<template>
  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in feeders" :key="row.id">
        <td>{{ row.name }}</td>
        <td>{{ row.phone }}</td>
        <td>
          <n-button size="small" type="success" @click="audit(row.id, true)">Approve</n-button>
          <n-button size="small" type="error" @click="audit(row.id, false)">Reject</n-button>
        </td>
      </tr>
    </tbody>
  </n-table>
</template>
