<template>
  <view>
    <view>订单号: {{ detail.id }}</view>
    <view>状态: {{ detail.status }}</view>
    <t-button v-if="detail.status === 'pending'" theme="primary" @click="pay">支付</t-button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 't-button': Button },
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
