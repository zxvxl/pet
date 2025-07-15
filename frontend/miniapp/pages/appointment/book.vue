<template>
  <view class="container">
    <picker mode="date" @change="onDateChange">
      <view>{{ date || '选择日期' }}</view>
    </picker>
    <input v-model="time" placeholder="服务时间" />
    <input v-model="address" placeholder="服务地址" />
    <textarea v-model="remark" placeholder="备注"></textarea>
    <button type="primary" @click="submit">预约</button>
  </view>
</template>

<script>
import { request } from '@/utils/request'

export default {
  data() {
    return {
      date: '',
      time: '',
      address: '',
      remark: ''
    }
  },
  methods: {
    onDateChange(e) {
      this.date = e.detail.value
    },
    submit() {
      request({
        url: '/orders',
        method: 'POST',
        data: {
          date: this.date,
          time: this.time,
          address: this.address,
          remark: this.remark
        }
      }).then(res => {
        uni.redirectTo({ url: '/pages/pay/result?id=' + res.id })
      })
    }
  }
}
</script>
