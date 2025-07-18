<template>
  <view class="container">
    <input v-model="form.name" placeholder="姓名" />
    <input v-model="form.phone" placeholder="手机号" />
    <input v-model="form.idCard" placeholder="身份证号" />
    <button @click="chooseAvatar">选择头像</button>
    <image v-if="form.avatar" :src="form.avatar" style="width:100px;height:100px" />
    <button type="primary" @click="submit">提交</button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
export default {
  data() {
    return { form: { name: '', phone: '', idCard: '', avatar: '' } }
  },
  methods: {
    chooseAvatar() {
      uni.chooseImage({ count: 1, success: res => { this.form.avatar = res.tempFilePaths[0] } })
    },
    submit() {
      request({ url: '/feeder/apply', method: 'POST', data: this.form }).then(() => {
        uni.redirectTo({ url: '/pages/feeder/status' })
      })
    }
  }
}
</script>

<style>
.container { padding: 20rpx; }
</style>
