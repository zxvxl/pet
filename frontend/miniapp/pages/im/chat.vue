<template>
  <view class="chat">
    <scroll-view :scroll-y="true" style="height:500rpx" :scroll-top="scrollTop">
      <view v-for="msg in messages" :key="msg.id">
        <text>{{ msg.senderId === userId ? '我' : '对方' }}: </text>
        <text v-if="msg.type === 'text'">{{ msg.payload.text }}</text>
      </view>
    </scroll-view>
    <input v-model="inputText" />
    <button type="primary" @click="send">发送</button>
    <button type="warn" @click="call">紧急联系</button>
  </view>
</template>

<script>
import { connect, send, onMessage } from '@/utils/im'
import store from '@/store'
import { request } from '@/utils/request'

export default {
  data() {
    return {
      orderId: 0,
      messages: [],
      userId: 0,
      inputText: '',
      scrollTop: 0
    }
  },
  onLoad(options) {
    this.orderId = options.id
    this.userId = store.state.user?.id || 0
    connect(this.orderId).then(() => {
      onMessage(msg => {
        this.messages.push(msg)
        this.scrollTop = this.messages.length * 100
      })
    })
    this.fetchHistory()
  },
  methods: {
    fetchHistory() {
      request({ url: '/im/history', method: 'GET', data: { orderId: this.orderId } })
        .then(res => { this.messages = res.reverse() })
    },
    send() {
      const msg = {
        type: 'text',
        receiverId: 0,
        orderId: this.orderId,
        payload: { text: this.inputText }
      }
      send(msg)
      this.messages.push({ ...msg, senderId: this.userId, id: Date.now() })
      this.inputText = ''
    },
    call() {
      request({ url: '/im/emergency', method: 'POST', data: { orderId: this.orderId } })
      uni.makePhoneCall({ phoneNumber: '12345678901' })
    }
  }
}
</script>
