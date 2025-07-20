<script setup>
import { ref, onMounted } from 'vue';
import { baseUrl } from '../config';

const orders = ref([]);
const fetchOrders = async () => {
  const res = await fetch(baseUrl + '/service-orders');
  const json = await res.json();
  orders.value = json.data || [];
};

onMounted(fetchOrders);
</script>
<template>
  <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>ID</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>{{ order.id }}</td>
        <td>{{ order.status }}</td>
      </tr>
    </tbody>
  </n-table>
</template>
