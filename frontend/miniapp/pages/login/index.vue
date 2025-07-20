<template>
  <view class="container">
    <t-button theme="primary" @click="doLogin">微信登录</t-button>
  </view>
</template>

<script>
import { login } from '@/utils/auth'
import { Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 't-button': Button },
  methods: {
    async doLogin() {
      try {
        await login()
        uni.reLaunch({ url: '/pages/user/profile' })
      } catch (e) {
        uni.showToast({ title: '登录失败', icon: 'none' })
      }
    }
  }
}
</script>

<style>
.container {
  padding: 30rpx;
}
</style>
