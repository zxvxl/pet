<template>
  <view class="container">
    <picker :range="pets" range-key="name" @change="selectPet">
      <view>{{ petText }}</view>
    </picker>
    <view class="time-row">
      <picker mode="datetime" @change="pickStart">
        <view>{{ startTime || '开始时间' }}</view>
      </picker>
      <picker mode="datetime" @change="pickEnd">
        <view>{{ endTime || '结束时间' }}</view>
      </picker>
    </view>
    <textarea v-model="remark" placeholder="地址备注" />
    <button type="primary" @click="submit">立即预约</button>
  </view>
</template>

<script>
import { request } from '@/utils/request'

export default {
  data() {
    return {
      pets: [],
      petIndex: -1,
      startTime: '',
      endTime: '',
      remark: ''
    }
  },
  computed: {
    petText() {
      return this.petIndex >= 0 ? this.pets[this.petIndex].name : '选择宠物'
    }
  },
  onShow() {
    request({ url: '/pets' }).then(res => {
      this.pets = res
    })
  },
  methods: {
    selectPet(e) {
      this.petIndex = e.detail.value
    },
    pickStart(e) {
      this.startTime = e.detail.value
    },
    pickEnd(e) {
      this.endTime = e.detail.value
    },
    submit() {
      if (this.petIndex < 0 || !this.startTime || !this.endTime) {
        uni.showToast({ title: '请填写完整', icon: 'none' })
        return
      }
      request({
        url: '/orders',
        method: 'POST',
        data: {
          petId: this.pets[this.petIndex].id,
          startTime: this.startTime,
          endTime: this.endTime,
          remark: this.remark
        }
      }).then(res => {
        uni.redirectTo({ url: `/pages/orders/detail?id=${res.id}` })
      })
    }
  }
}
</script>

<style>
.container { padding: 20rpx; }
.time-row { display: flex; justify-content: space-between; margin: 20rpx 0; }
</style>
