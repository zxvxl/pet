<template>
  <view>
    <view>昵称：{{ user && user.nickname }}</view>
    <t-button @click="logout">退出登录</t-button>
  </view>
</template>

<script>
import store from '@/store'
import { Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 't-button': Button },
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
