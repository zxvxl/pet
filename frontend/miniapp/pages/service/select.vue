<template>
  <view class="service-select">
    <t-checkbox-group v-model="selected">
      <label v-for="item in list" :key="item.id" class="service-item">
        <image :src="item.coverUrl" class="cover" />
        <view class="info">
          <view class="name">{{ item.name }}</view>
          <view class="price">￥{{ item.price }} / 会员￥{{ item.memberPrice }}</view>
        <t-checkbox :value="String(item.id)" />
        </view>
      </label>
    </t-checkbox-group>
    <t-button theme="primary" @click="next">下一步</t-button>
  </view>
</template>
<script>
import { request } from '@/utils/request'
import { CheckboxGroup, Checkbox, Button } from 'tdesign-miniprogram/vue'
export default {
  components: {
    't-checkbox-group': CheckboxGroup,
    't-checkbox': Checkbox,
    't-button': Button
  },
  data() {
    return { list: [], selected: [] }
  },
  onShow() {
    request({ url: '/service-types' }).then(res => {
      this.list = res
    })
  },
  methods: {
    next() {
      if (!this.selected.length) {
        uni.showToast({ title: '请选择服务', icon: 'none' })
        return
      }
      uni.navigateTo({ url: '/pages/service/pet-bind?ids=' + this.selected.join(',') })
    }
  }
}
</script>
<style>
.service-item { margin: 20rpx 0; display:flex; }
.cover { width:100rpx; height:100rpx; }
.info { flex:1; margin-left:20rpx; }
</style>
