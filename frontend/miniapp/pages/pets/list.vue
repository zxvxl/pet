<template>
  <view class="container">
    <view v-for="pet in pets" :key="pet.id" class="pet-item">
      <text>{{ pet.name }}</text>
    </view>
    <button type="primary" @click="goAdd">添加宠物</button>
  </view>
</template>

<script>
import { request } from '@/utils/request'

export default {
  data() {
    return {
      pets: []
    }
  },
  onShow() {
    this.fetchPets()
  },
  methods: {
    fetchPets() {
      request({ url: '/pets' }).then(res => {
        this.pets = res
      })
    },
    goAdd() {
      uni.navigateTo({ url: '/pages/pets/edit' })
    }
  }
}
</script>
