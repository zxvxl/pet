<template>
  <view>
    <view>支付结果: {{ status }}</view>
    <t-button @click="goOrders">查看订单</t-button>
  </view>
</template>

<script>
import { Button } from 'tdesign-miniprogram/vue'
export default {
  components: { 't-button': Button },
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
