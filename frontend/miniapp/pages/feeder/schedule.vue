<template>
  <view class="container">
    <view class="tabs">
      <view
        v-for="(d, i) in weekdays"
        :key="i"
        :class="['tab', { active: selectedDay === i }]"
        @click="selectedDay = i"
      >{{ d }}</view>
    </view>
    <view class="item" v-for="(r, idx) in dayRanges" :key="idx">
      <picker mode="time" :value="r.startTime" @change="changeTime(idx, 'startTime', $event)">
        <view class="time">{{ r.startTime || '开始时间' }}</view>
      </picker>
      <picker mode="time" :value="r.endTime" @change="changeTime(idx, 'endTime', $event)">
        <view class="time">{{ r.endTime || '结束时间' }}</view>
      </picker>
      <button size="mini" @click="removeRange(idx)">删除</button>
    </view>
    <button size="mini" @click="addRange">添加时间段</button>
    <button type="primary" @click="save" :loading="isLoading">保存</button>
  </view>
</template>

<script>
import { request } from '@/utils/request'
export default {
  data() {
    return {
      weekdays: ['周一','周二','周三','周四','周五','周六','周日'],
      selectedDay: 0,
      scheduleList: [],
      isLoading: false
    }
  },
  computed: {
    dayRanges() {
      const day = this.scheduleList.find(s => s.weekday === this.selectedDay)
      return day ? day.ranges : []
    }
  },
  onLoad() {
    this.initList()
  },
  methods: {
    initList() {
      this.isLoading = true
      request({ url: '/feeder-schedules/me' }).then(res => {
        this.scheduleList = [0,1,2,3,4,5,6].map(i => ({
          weekday: i,
          ranges: res.filter(r => r.weekday === i).map(v => ({
            startTime: v.startTime,
            endTime: v.endTime
          }))
        }))
      }).finally(() => { this.isLoading = false })
    },
    addRange() {
      const day = this.scheduleList.find(s => s.weekday === this.selectedDay)
      if (day) day.ranges.push({ startTime: '09:00:00', endTime: '18:00:00' })
    },
    removeRange(i) {
      const day = this.scheduleList.find(s => s.weekday === this.selectedDay)
      if (day) day.ranges.splice(i, 1)
    },
    changeTime(i, field, e) {
      const day = this.scheduleList.find(s => s.weekday === this.selectedDay)
      if (day) day.ranges[i][field] = e.detail.value + ':00'
    },
    save() {
      const items = this.scheduleList.flatMap(d =>
        d.ranges.map(r => ({
          weekday: d.weekday,
          startTime: r.startTime,
          endTime: r.endTime
        }))
      )
      this.isLoading = true
      request({ url: '/feeder-schedules/batch', method: 'POST', data: { items } })
        .then(() => uni.showToast({ title: '保存成功' }))
        .finally(() => { this.isLoading = false })
    }
  }
}
</script>

<style>
.container { padding: 20rpx; }
.tabs { display: flex; margin-bottom: 20rpx; }
.tab { flex: 1; text-align: center; padding: 10rpx; border-bottom: 2rpx solid #eee; }
.tab.active { border-color: #007aff; color: #007aff; }
.item { display: flex; align-items: center; margin: 10rpx 0; }
.time { width: 200rpx; }
</style>
