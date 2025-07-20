<template>
  <view class="container">
    <view>宠物：{{ detail.pet?.name }}</view>
    <view>喂养员：{{ detail.feeder?.name || '待分配' }}</view>
    <view>时间：{{ detail.startTime }} ~ {{ detail.endTime }}</view>
    <view>状态：{{ detail.status }}</view>
    <t-button v-if="detail.status === 'pending'" @click="cancel">取消订单</t-button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 't-button': Button },
  data() {
    return { id: 0, detail: {} }
  },
  onLoad(options) {
    this.id = options.id
    this.fetch()
  },
  methods: {
    fetch() {
      request({ url: `/orders/${this.id}` }).then(res => {
        this.detail = res
      })
    },
    cancel() {
      request({ url: `/orders/${this.id}`, method: 'DELETE' }).then(() => {
        uni.navigateBack()
      })
    }
  }
}
</script>

<style>
.container { padding: 20rpx; }
</style>
