<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';
const feeders = ref([]);
const fetchFeeders = async () => {
  const res = await fetch('/admin/feeders');
  const json = await res.json();
  feeders.value = json.data || [];
};
const audit = async (id, approve) => {
  await fetch('/admin/feeders/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feederId: id, approve }),
  });
  fetchFeeders();
};
onMounted(fetchFeeders);
</script>
<template>
  <el-table :data="feeders" style="width: 100%">
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="phone" label="Phone" />
    <el-table-column>
      <template #default="{ row }">
        <el-button type="success" @click="audit(row.id, true)">Approve</el-button>
        <el-button type="danger" @click="audit(row.id, false)">Reject</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
