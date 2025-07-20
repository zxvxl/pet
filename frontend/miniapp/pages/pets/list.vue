<template>
  <view class="container">
    <view v-for="pet in pets" :key="pet.id" class="pet-item">
      <text>{{ pet.name }}</text>
    </view>
    <t-button theme="primary" @click="goAdd">添加宠物</t-button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 't-button': Button },
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
