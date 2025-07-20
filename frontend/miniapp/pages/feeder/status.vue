<template>
  <view class="container">
    <view>状态：{{ statusText }}</view>
    <view v-if="profile && profile.status === 2">原因：{{ profile.rejectReason }}</view>
    <t-button v-if="profile && profile.status === 2" @click="reapply">重新申请</t-button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { Button } from 'tdesign-miniprogram/vue'
export default {
  components: { 't-button': Button },
  data() {
    return { profile: null }
  },
  onShow() {
    request({ url: '/feeder/profile' }).then(res => { this.profile = res })
  },
  computed: {
    statusText() {
      const s = this.profile ? this.profile.status : 0
      return ['待审核', '通过', '驳回'][s]
    }
  },
  methods: {
    reapply() {
      uni.redirectTo({ url: '/pages/feeder/apply' })
    }
  }
}
</script>

<style>
.container { padding: 20rpx; }
</style>
