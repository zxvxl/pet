<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);
const fetchOrders = async () => {
  const res = await fetch('/service-orders');
  const json = await res.json();
  orders.value = json.data || [];
};

onMounted(fetchOrders);
</script>
<template>
  <el-table :data="orders" style="width: 100%">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="status" label="Status" />
  </el-table>
</template>
