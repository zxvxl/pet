<template>
  <view class="container">
    <!-- 支付结果 -->
    <view class="result-section">
      <view class="result-icon">
        <text class="icon-text">{{ resultIcon }}</text>
      </view>
      <text class="result-title">{{ resultTitle }}</text>
      <text class="result-desc">{{ resultDesc }}</text>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="section-title">订单信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">订单号</text>
          <text class="info-value">{{ orderInfo.orderNo }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">支付金额</text>
          <text class="info-value price">¥{{ orderInfo.amount }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">支付方式</text>
          <text class="info-value">{{ orderInfo.paymentMethod }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">支付时间</text>
          <text class="info-value">{{ formatTime(orderInfo.payTime) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">服务项目</text>
          <text class="info-value">{{ orderInfo.serviceName }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">服务时间</text>
          <text class="info-value">{{ formatDateTime(orderInfo.serviceDate, orderInfo.serviceTime) }}</text>
        </view>
      </view>
    </view>

    <!-- 服务状态 -->
    <view class="service-status" v-if="orderInfo.status">
      <view class="section-title">服务状态</view>
      <view class="status-timeline">
        <view 
          v-for="(step, index) in statusSteps" 
          :key="index"
          :class="['timeline-item', { active: step.active, completed: step.completed }]"
        >
          <view class="timeline-icon">
            <text class="step-icon">{{ step.icon }}</text>
          </view>
          <view class="timeline-content">
            <text class="step-title">{{ step.title }}</text>
            <text class="step-desc">{{ step.desc }}</text>
            <text class="step-time" v-if="step.time">{{ step.time }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 联系信息 -->
    <view class="contact-info" v-if="orderInfo.feeder">
      <view class="section-title">联系喂养员</view>
      <view class="feeder-card">
        <view class="feeder-avatar">
          <image 
            v-if="orderInfo.feeder.avatar" 
            :src="orderInfo.feeder.avatar" 
            mode="aspectFill"
            class="avatar-image"
          />
          <view v-else class="avatar-placeholder">
            <text class="placeholder-text">{{ orderInfo.feeder.name.charAt(0) }}</text>
          </view>
        </view>
        <view class="feeder-info">
          <text class="feeder-name">{{ orderInfo.feeder.name }}</text>
          <view class="feeder-rating">
            <text class="rating-stars">⭐⭐⭐⭐⭐</text>
            <text class="rating-score">{{ orderInfo.feeder.rating }}</text>
          </view>
          <text class="feeder-phone">{{ orderInfo.feeder.phone }}</text>
        </view>
        <view class="feeder-actions">
          <t-button 
            theme="primary" 
            size="small"
            @click="callFeeder"
            class="call-btn"
          >
            拨打电话
          </t-button>
          <t-button 
            theme="light" 
            size="small"
            @click="chatFeeder"
            class="chat-btn"
          >
            在线聊天
          </t-button>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons">
      <view class="button-group">
        <t-button 
          theme="light" 
          size="large"
          @click="viewOrder"
          class="action-btn"
        >
          查看订单
        </t-button>
        <t-button 
          theme="primary" 
          size="large"
          @click="goHome"
          class="action-btn"
        >
          返回首页
        </t-button>
      </view>
      
      <view class="quick-actions">
        <view class="quick-item" @click="goToOrders">
          <view class="quick-icon">📋</view>
          <text class="quick-text">我的订单</text>
        </view>
        <view class="quick-item" @click="goToChat">
          <view class="quick-icon">💬</view>
          <text class="quick-text">在线客服</text>
        </view>
        <view class="quick-item" @click="shareOrder">
          <view class="quick-icon">📤</view>
          <text class="quick-text">分享订单</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 't-button': Button },
  data() {
    return {
      orderId: '',
      status: 'success', // success, failed, pending
      orderInfo: {},
      statusSteps: [
        {
          title: '订单已支付',
          desc: '您的订单已成功支付',
          icon: '✅',
          completed: true,
          active: false,
          time: ''
        },
        {
          title: '等待确认',
          desc: '喂养员正在确认订单',
          icon: '⏳',
          completed: false,
          active: true,
          time: ''
        },
        {
          title: '服务进行中',
          desc: '喂养员正在为您服务',
          icon: '🔄',
          completed: false,
          active: false,
          time: ''
        },
        {
          title: '服务完成',
          desc: '服务已完成，请及时评价',
          icon: '🎉',
          completed: false,
          active: false,
          time: ''
        }
      ]
    }
  },
  computed: {
    resultIcon() {
      switch (this.status) {
        case 'success':
          return '🎉'
        case 'failed':
          return '❌'
        case 'pending':
          return '⏳'
        default:
          return '❓'
      }
    },
    resultTitle() {
      switch (this.status) {
        case 'success':
          return '支付成功'
        case 'failed':
          return '支付失败'
        case 'pending':
          return '支付处理中'
        default:
          return '支付状态未知'
      }
    },
    resultDesc() {
      switch (this.status) {
        case 'success':
          return '您的订单已成功支付，喂养员将尽快与您联系'
        case 'failed':
          return '支付遇到问题，请重新尝试或联系客服'
        case 'pending':
          return '支付正在处理中，请稍后查看结果'
        default:
          return '请稍后查看支付结果'
      }
    }
  },
  onLoad(options) {
    this.orderId = options.orderId || ''
    this.status = options.status || 'success'
    this.loadOrderInfo()
  },
  methods: {
    async loadOrderInfo() {
      try {
        if (this.orderId) {
          const res = await request({ url: `/orders/${this.orderId}` })
          this.orderInfo = res
          this.updateStatusSteps()
        } else {
          // 使用模拟数据
          this.orderInfo = {
            orderNo: 'PF' + Date.now(),
            amount: 158,
            paymentMethod: '微信支付',
            payTime: new Date().toISOString(),
            serviceName: '宠物喂养 + 基础护理',
            serviceDate: '2024-01-15',
            serviceTime: '14:00',
            status: 'pending',
            feeder: {
              name: '张阿姨',
              avatar: '',
              rating: 4.9,
              phone: '138****8888'
            }
          }
          this.updateStatusSteps()
        }
      } catch (error) {
        uni.showToast({ 
          title: '加载订单信息失败', 
          icon: 'none' 
        })
      }
    },
    updateStatusSteps() {
      const status = this.orderInfo.status
      const now = new Date().toLocaleString()
      
      this.statusSteps.forEach((step, index) => {
        if (index === 0) {
          step.completed = true
          step.active = false
          step.time = now
        } else if (index === 1) {
          step.completed = status === 'confirmed' || status === 'serving' || status === 'completed'
          step.active = status === 'pending'
          step.time = step.completed ? now : ''
        } else if (index === 2) {
          step.completed = status === 'completed'
          step.active = status === 'serving'
          step.time = step.completed ? now : ''
        } else if (index === 3) {
          step.completed = status === 'completed'
          step.active = false
          step.time = step.completed ? now : ''
        }
      })
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return date.toLocaleString()
    },
    formatDateTime(date, time) {
      if (!date || !time) return '未设置'
      const dateObj = new Date(date)
      const month = dateObj.getMonth() + 1
      const day = dateObj.getDate()
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      const weekday = weekdays[dateObj.getDay()]
      return `${month}月${day}日 周${weekday} ${time}`
    },
    callFeeder() {
      if (this.orderInfo.feeder?.phone) {
        uni.makePhoneCall({
          phoneNumber: this.orderInfo.feeder.phone
        })
      }
    },
    chatFeeder() {
      uni.navigateTo({ 
        url: `/pages/im/chat?orderId=${this.orderId}` 
      })
    },
    viewOrder() {
      uni.navigateTo({ 
        url: `/pages/orders/detail?id=${this.orderId}` 
      })
    },
    goHome() {
      uni.switchTab({ url: '/pages/home/index' })
    },
    goToOrders() {
      uni.switchTab({ url: '/pages/order/index' })
    },
    goToChat() {
      uni.navigateTo({ url: '/pages/chat/index' })
    },
    shareOrder() {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    }
  },
  onShareAppMessage() {
    return {
      title: '我在宠物喂养小程序预约了服务',
      path: `/pages/orders/detail?id=${this.orderId}`
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding-bottom: var(--spacing-xl);
}

.result-section {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%);
  padding: var(--spacing-xxl) var(--spacing-lg);
  text-align: center;
  color: white;
}

.result-icon {
  margin-bottom: var(--spacing-lg);
}

.icon-text {
  font-size: 120rpx;
}

.result-title {
  display: block;
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-sm);
}

.result-desc {
  display: block;
  font-size: var(--font-size-md);
  opacity: 0.9;
  line-height: 1.5;
}

.order-info,
.service-status,
.contact-info {
  background: var(--bg-primary);
  margin: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-light);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.info-value {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  text-align: right;
}

.info-value.price {
  color: var(--brand-error);
  font-weight: var(--font-weight-semibold);
}

.status-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.timeline-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
  border: 2rpx solid var(--border-light);
  flex-shrink: 0;
  transition: var(--transition-normal);
}

.timeline-item.active .timeline-icon {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: white;
}

.timeline-item.completed .timeline-icon {
  background: var(--brand-success);
  border-color: var(--brand-success);
  color: white;
}

.step-icon {
  font-size: var(--font-size-lg);
}

.timeline-content {
  flex: 1;
  padding-top: var(--spacing-xs);
}

.step-title {
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.step-desc {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: 4rpx;
}

.step-time {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.feeder-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--bg-light);
  border-radius: var(--radius-lg);
}

.feeder-avatar {
  margin-right: var(--spacing-md);
}

.avatar-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: var(--radius-round);
}

.avatar-placeholder {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--bg-primary);
}

.feeder-info {
  flex: 1;
}

.feeder-name {
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.feeder-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: 4rpx;
}

.rating-stars {
  font-size: var(--font-size-xs);
}

.rating-score {
  font-size: var(--font-size-xs);
  color: var(--brand-warning);
  font-weight: var(--font-weight-medium);
}

.feeder-phone {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.feeder-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.call-btn,
.chat-btn {
  min-width: 120rpx;
}

.action-buttons {
  padding: var(--spacing-lg);
}

.button-group {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.action-btn {
  flex: 1;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: var(--spacing-lg) 0;
  border-top: 1px solid var(--border-light);
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  transition: var(--transition-normal);
}

.quick-item:active {
  transform: scale(0.95);
}

.quick-icon {
  width: 60rpx;
  height: 60rpx;
  background: var(--bg-light);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
}

.quick-text {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}
</style>
