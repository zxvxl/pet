<template>
  <view>
    <view v-for="item in orders" :key="item.id" @click="goDetail(item.id)">
      <text>{{ item.date }} {{ item.status }}</text>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request'

export default {
  data() {
    return { orders: [] }
  },
  onShow() {
    request({ url: '/orders' }).then(res => {
      this.orders = res
    })
  },
  methods: {
    goDetail(id) {
      uni.navigateTo({ url: '/pages/orders/detail?id=' + id })
    }
  }
}
</script>
