<script setup>
import { ref, onMounted } from 'vue';
import { baseUrl } from '../config';
import { ElMessageBox } from 'element-plus';
const feeders = ref([]);
const fetchFeeders = async () => {
  const res = await fetch(baseUrl + '/admin/feeders');
  const json = await res.json();
  feeders.value = json.data || [];
};
const audit = async (id, approve) => {
  let reason = '';
  if (!approve) {
    const res = await ElMessageBox.prompt('请输入拒绝原因', '驳回', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).catch(() => null);
    if (!res) return;
    reason = res.value;
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
