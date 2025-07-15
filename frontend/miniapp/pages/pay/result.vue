<template>
  <view>
    <view>支付结果: {{ status }}</view>
    <button @click="goOrders">查看订单</button>
  </view>
</template>

<script>
export default {
  data() {
    return { status: '成功' }
  },
  methods: {
    goOrders() {
      uni.redirectTo({ url: '/pages/orders/list' })
    }
  }
}
</script>
