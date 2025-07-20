<template>
  <view class="confirm">
    <view v-for="it in data.items" :key="it.serviceId" class="row">
      <text>{{ it.serviceName }} - {{ it.petName }}</text>
    </view>
    <view>预约时间：{{ data.reserveTime }}</view>
    <view>地址：{{ data.address }}</view>
    <view>备注：{{ data.remark }}</view>
    <t-button theme="primary" @click="submit">立即预约</t-button>
  </view>
</template>
<script>
import { request } from '@/utils/request'
import { Button } from 'tdesign-miniprogram/vue'
export default {
  components: { 't-button': Button },
  data() {
    return { data: {}, total: 0 }
  },
  onLoad(q) {
    this.data = JSON.parse(decodeURIComponent(q.data))
  },
  methods: {
    submit() {
      request({
        url: '/reserve-orders',
        method: 'POST',
        data: this.data
      }).then(res => {
        uni.redirectTo({ url: '/pages/orders/detail?id=' + res.id })
      })
    }
  }
}
</script>
<style>
.row { margin:20rpx 0; }
</style>
