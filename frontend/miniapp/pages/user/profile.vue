<template>
  <view>
    <view>昵称：{{ user && user.nickname }}</view>
    <button @click="logout">退出登录</button>
  </view>
</template>

<script>
import store from '@/store'

export default {
  computed: {
    user() {
      return store.state.user
    }
  },
  methods: {
    logout() {
      store.commit('setToken', '')
      store.commit('setUser', null)
      uni.reLaunch({ url: '/pages/login/index' })
    }
  }
}
</script>
