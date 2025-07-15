<template>
  <view class="container">
    <button type="primary" @click="doLogin">微信登录</button>
  </view>
</template>

<script>
import { login } from '@/utils/auth'

export default {
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
