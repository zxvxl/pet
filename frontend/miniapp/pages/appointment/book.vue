<template>
  <view class="container">
    <t-date-time-picker mode="date" @change="onDateChange">
      <view>{{ date || '选择日期' }}</view>
    </t-date-time-picker>
    <t-input v-model="time" placeholder="服务时间" />
    <t-input v-model="address" placeholder="服务地址" />
    <t-textarea v-model="remark" placeholder="备注" />
    <t-button theme="primary" @click="submit">预约</t-button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { DateTimePicker, Input, Textarea, Button } from 'tdesign-miniprogram/vue'

export default {
  components: {
    't-date-time-picker': DateTimePicker,
    't-input': Input,
    't-textarea': Textarea,
    't-button': Button
  },
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
