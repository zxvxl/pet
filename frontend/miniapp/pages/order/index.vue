<template>
  <view class="container">
    <view v-for="o in orders" :key="o.id" class="item" @click="go(o.id)">
      <text>{{ o.pet.name }} {{ o.status }}</text>
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
    go(id) {
      uni.navigateTo({ url: '/pages/order/detail?id=' + id })
    }
  }
}
</script>

<style>
.container { padding: 20rpx; }
.item { padding: 20rpx; border-bottom: 1px solid #eee; }
</style>
