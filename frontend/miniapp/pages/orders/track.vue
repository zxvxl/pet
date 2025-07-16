<template>
  <view>
    <uni-steps :options="steps" :active="active" direction="column" />
    <map :longitude="location.lng" :latitude="location.lat" style="width:100%;height:300rpx" />
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { baseUrl } from '@/config'

export default {
  data() {
    return {
      id: 0,
      steps: [
        { title: '接单' },
        { title: '出发' },
        { title: '签到' },
        { title: '服务中' },
        { title: '完成' }
      ],
      active: 0,
      location: { lat: 0, lng: 0 },
      ws: null
    }
  },
  onLoad(options) {
    this.id = options.id
    this.fetchStatus()
    this.connectWs()
  },
  onUnload() {
    if (this.ws) this.ws.close()
  },
  methods: {
    fetchStatus() {
      request({ url: `/service/${this.id}/status` }).then(res => {
        this.active = res.status
      })
    },
    connectWs() {
      const wsUrl = baseUrl.replace(/^http/, 'ws') + `/service?orderId=${this.id}`
      const ws = uni.connectSocket({ url: wsUrl })
      ws.onMessage(msg => {
        const data = JSON.parse(msg.data)
        if (data.type === 'status') this.active = data.status
        if (data.type === 'location') this.location = { lat: data.lat, lng: data.lng }
      })
      this.ws = ws
      // fallback polling
      setInterval(() => {
        if (ws.readyState !== 1) this.fetchStatus()
      }, 60000)
    }
  }
}
</script>

