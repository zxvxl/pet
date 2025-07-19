<template>
  <view class="pet-bind">
    <view v-if="pets.length === 0">
      <text>暂无宠物</text>
      <button @click="goAdd">添加宠物</button>
    </view>
    <view v-else>
      <view v-for="srv in services" :key="srv.id" class="bind-row">
        <text>{{ srv.name }}</text>
        <picker :range="pets" range-key="name" @change="e => select(srv.id, e.detail.value)">
          <view>{{ pickText(srv.id) }}</view>
        </picker>
      </view>
      <button type="primary" @click="next">下一步</button>
    </view>
  </view>
</template>
<script>
import { request } from '@/utils/request'
export default {
  data() {
    return { services: [], pets: [], map: {} }
  },
  onLoad(query) {
    const ids = query.ids.split(',')
    request({ url: '/service-types' }).then(res => {
      this.services = res.filter(i => ids.includes(String(i.id)))
    })
  },
  onShow() {
    request({ url: '/pets' }).then(res => { this.pets = res })
  },
  methods: {
    goAdd() { uni.navigateTo({ url: '/pages/pets/edit' }) },
    select(id, idx) { this.$set(this.map, id, idx) },
    pickText(id) {
      const idx = this.map[id];
      return idx >= 0 ? this.pets[idx].name : '选择宠物'
    },
    next() {
      const items = this.services.map(s => ({
        serviceId: s.id,
        petId: this.pets[this.map[s.id]]?.id,
        serviceName: s.name,
        petName: this.pets[this.map[s.id]]?.name,
      }))
      if (items.some(i => !i.petId)) {
        uni.showToast({ title: '请选择宠物', icon: 'none' })
        return
      }
      uni.navigateTo({ url: '/pages/service/reserve?data=' + encodeURIComponent(JSON.stringify(items)) })
    }
  }
}
</script>
<style>
.bind-row { margin:20rpx 0; }
</style>
