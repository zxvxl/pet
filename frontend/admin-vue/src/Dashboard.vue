<script setup>
import { ref, onMounted } from 'vue'
import { baseUrl } from '../config'

const overview = ref({ orders: 0, pendingOrders: 0, finishedOrders: 0, feeders: 0, pendingFeeders: 0, users: 0, activeUsers: 0 })

const fetchOverview = async () => {
  try {
    const res = await fetch(baseUrl + '/admin/dashboard')
    const json = await res.json()
    overview.value = json.data || overview.value
  } catch (e) {
    console.error(e)
  }
}

onMounted(fetchOverview)
</script>

<template>
  <div>
    <n-grid :x-gap="16" :y-gap="16" :cols="3">
      <n-gi>
        <n-card title="订单统计">
          <p>总订单数：{{ overview.orders }}</p>
          <p>待处理：{{ overview.pendingOrders }}</p>
          <p>已完成：{{ overview.finishedOrders }}</p>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="喂养员统计">
          <p>总喂养员：{{ overview.feeders }}</p>
          <p>待审核：{{ overview.pendingFeeders }}</p>
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="用户统计">
          <p>总用户：{{ overview.users }}</p>
          <p>活跃用户：{{ overview.activeUsers }}</p>
        </n-card>
      </n-gi>
    </n-grid>
    <n-card title="快捷入口" style="margin-top: 20px">
      <n-space>
        <n-button type="primary">添加订单</n-button>
        <n-button type="info">管理喂养员</n-button>
        <n-button type="success">查看服务项</n-button>
      </n-space>
    </n-card>
    <n-card title="统计图表" style="margin-top: 20px">
      <n-empty description="图表待集成" />
    </n-card>
  </div>
</template>
