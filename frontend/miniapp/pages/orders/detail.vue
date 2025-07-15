<template>
  <view>
    <view>订单号: {{ detail.id }}</view>
    <view>状态: {{ detail.status }}</view>
    <button v-if="detail.status === 'pending'" type="primary" @click="pay">支付</button>
  </view>
</template>

<script>
import { request } from '@/utils/request'

export default {
  data() {
    return { detail: {} }
  },
  onLoad(options) {
    request({ url: '/orders/' + options.id }).then(res => {
      this.detail = res
    })
  },
  methods: {
    pay() {
      request({ url: `/orders/${this.detail.id}/pay` }).then(payData => {
        wx.requestPayment({
          ...payData,
          success: () => {
            uni.showToast({ title: '支付成功' })
            this.detail.status = 'paid'
          },
          fail: () => {
            uni.showToast({ title: '支付失败', icon: 'none' })
          }
        })
      })
    }
  }
}
</script>
