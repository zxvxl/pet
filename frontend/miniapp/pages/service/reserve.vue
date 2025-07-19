<template>
  <view class="reserve">
    <view v-for="it in items" :key="it.serviceId" class="row">
      <text>{{ it.serviceName }} - {{ it.petName }}</text>
    </view>
    <picker mode="datetime" @change="e => reserveTime = e.detail.value">
      <view>{{ reserveTime || '选择时间' }}</view>
    </picker>
    <input v-model="address" placeholder="服务地址" />
    <textarea v-model="remark" placeholder="备注" />
    <button type="primary" @click="next">确认</button>
  </view>
</template>
<script>
export default {
  data() {
    return { items: [], reserveTime: '', address: '', remark: '' }
  },
  onLoad(q) {
    this.items = JSON.parse(decodeURIComponent(q.data))
  },
  methods: {
    next() {
      if (!this.reserveTime || !this.address) {
        uni.showToast({ title: '请填写完整', icon: 'none' })
        return
      }
      const data = {
        items: this.items.map(i => ({ serviceId: i.serviceId, petId: i.petId })),
        reserveTime: this.reserveTime,
        address: this.address,
        remark: this.remark
      }
      uni.navigateTo({ url: '/pages/service/confirm?data=' + encodeURIComponent(JSON.stringify(data)) })
    }
  }
}
</script>
<style>
.row { margin:20rpx 0; }
</style>
