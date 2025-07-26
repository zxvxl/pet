<template>
  <view class="container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">我的订单</text>
        <view class="order-stats">
          <text class="stats-text">共 {{ totalOrders }} 个订单</text>
        </view>
      </view>
    </view>

    <!-- 订单状态Tabs -->
    <view class="tabs-container">
      <view class="tabs">
        <view 
          v-for="(tab, index) in tabs" 
          :key="index"
          :class="['tab-item', { active: activeTab === index }]"
          @click="switchTab(index)"
        >
          <text class="tab-text">{{ tab.name }}</text>
          <view v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</view>
        </view>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view v-if="filteredOrders.length === 0" class="empty-state">
        <view class="empty-icon">📋</view>
        <text class="empty-title">{{ getEmptyText() }}</text>
        <text class="empty-desc">{{ getEmptyDesc() }}</text>
        <t-button 
          v-if="activeTab === 0" 
          theme="primary" 
          size="large" 
          @click="goCreateOrder"
          class="create-btn"
        >
          立即预约
        </t-button>
      </view>

      <view v-else>
        <view 
          v-for="order in filteredOrders" 
          :key="order.id" 
          class="order-card"
          @click="goDetail(order.id)"
        >
          <view class="card-header">
            <view class="order-info">
              <view class="order-number">订单号：{{ order.id }}</view>
              <view class="order-status">
                <view :class="['status-badge', `status-${order.status}`]">
                  {{ getStatusText(order.status) }}
                </view>
              </view>
            </view>
            <view class="order-time">
              <text class="time-label">预约时间</text>
              <text class="time-value">{{ formatTime(order.startTime) }}</text>
            </view>
          </view>

          <view class="card-body">
            <view class="pet-info">
              <view class="pet-avatar">
                <image 
                  v-if="order.pet?.avatar" 
                  :src="order.pet.avatar" 
                  mode="aspectFill"
                  class="avatar-image"
                />
                <view v-else class="avatar-placeholder">
                  <text class="placeholder-text">{{ order.pet?.name?.charAt(0) || '🐾' }}</text>
                </view>
              </view>
              <view class="pet-details">
                <text class="pet-name">{{ order.pet?.name || '未知宠物' }}</text>
                <text class="pet-type">{{ order.pet?.type || '未知品种' }}</text>
              </view>
            </view>

            <view class="feeder-info" v-if="order.feeder">
              <view class="feeder-avatar">
                <image 
                  v-if="order.feeder.avatar" 
                  :src="order.feeder.avatar" 
                  mode="aspectFill"
                  class="avatar-image"
                />
                <view v-else class="avatar-placeholder">
                  <text class="placeholder-text">{{ order.feeder.name?.charAt(0) || '👤' }}</text>
                </view>
              </view>
              <view class="feeder-details">
                <text class="feeder-name">{{ order.feeder.name }}</text>
                <text class="feeder-title">喂养员</text>
              </view>
            </view>

            <view class="service-info">
              <view class="service-item">
                <text class="service-label">服务项目</text>
                <text class="service-value">{{ order.serviceName || '宠物喂养' }}</text>
              </view>
              <view class="service-item">
                <text class="service-label">服务地址</text>
                <text class="service-value">{{ order.address || '未设置' }}</text>
              </view>
            </view>
          </view>

          <view class="card-footer">
            <view class="price-info">
              <text class="price-label">服务费用</text>
              <text class="price-value">¥{{ order.price || 0 }}</text>
            </view>
            <view class="action-buttons">
              <t-button 
                v-if="order.status === 'pending'" 
                theme="danger" 
                size="small"
                @click.stop="cancelOrder(order.id)"
                class="action-btn"
              >
                取消订单
              </t-button>
              <t-button 
                v-if="order.status === 'serving'" 
                theme="primary" 
                size="small"
                @click.stop="goChat(order.id)"
                class="action-btn"
              >
                联系喂养员
              </t-button>
              <t-button 
                v-if="order.status === 'completed'" 
                theme="light" 
                size="small"
                @click.stop="goEvaluate(order.id)"
                class="action-btn"
              >
                评价服务
              </t-button>
              <t-button 
                theme="light" 
                size="small"
                @click.stop="goDetail(order.id)"
                class="action-btn"
              >
                查看详情
              </t-button>
            </view>
          </view>
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
      orders: [],
      activeTab: 0,
      tabs: [
        { name: '待服务', status: 'pending', count: 0 },
        { name: '服务中', status: 'serving', count: 0 },
        { name: '已完成', status: 'completed', count: 0 }
      ]
    }
  },
  computed: {
    totalOrders() {
      return this.orders.length
    },
    filteredOrders() {
      if (this.activeTab === 0) {
        return this.orders.filter(order => order.status === 'pending')
      } else if (this.activeTab === 1) {
        return this.orders.filter(order => order.status === 'serving')
      } else {
        return this.orders.filter(order => order.status === 'completed')
      }
    }
  },
  onShow() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      try {
        const res = await request({ url: '/orders' })
        this.orders = res
        this.updateTabCounts()
      } catch (error) {
        uni.showToast({ 
          title: '获取订单列表失败', 
          icon: 'none' 
        })
      }
    },
    updateTabCounts() {
      this.tabs[0].count = this.orders.filter(o => o.status === 'pending').length
      this.tabs[1].count = this.orders.filter(o => o.status === 'serving').length
      this.tabs[2].count = this.orders.filter(o => o.status === 'completed').length
    },
    switchTab(index) {
      this.activeTab = index
    },
    getStatusText(status) {
      const statusMap = {
        'pending': '待服务',
        'serving': '服务中',
        'completed': '已完成',
        'cancelled': '已取消'
      }
      return statusMap[status] || '未知状态'
    },
    formatTime(time) {
      if (!time) return '未设置'
      const date = new Date(time)
      return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
    },
    getEmptyText() {
      const texts = ['暂无待服务订单', '暂无服务中订单', '暂无已完成订单']
      return texts[this.activeTab]
    },
    getEmptyDesc() {
      const descs = ['快去预约服务吧', '服务正在进行中', '期待您的下次预约']
      return descs[this.activeTab]
    },
    goCreateOrder() {
      uni.navigateTo({ url: '/pages/service/select' })
    },
    goDetail(id) {
      uni.navigateTo({ url: `/pages/order/detail?id=${id}` })
    },
    goChat(id) {
      uni.navigateTo({ url: `/pages/im/chat?id=${id}` })
    },
    goEvaluate(id) {
      uni.navigateTo({ url: `/pages/evaluation/create?orderId=${id}` })
    },
    async cancelOrder(id) {
      uni.showModal({
        title: '确认取消',
        content: '确定要取消这个订单吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await request({ 
                url: `/orders/${id}`, 
                method: 'DELETE' 
              })
              uni.showToast({ title: '取消成功' })
              this.fetchOrders()
            } catch (error) {
              uni.showToast({ 
                title: '取消失败', 
                icon: 'none' 
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #F5A623 0%, #FFB74D 100%);
  padding: 40rpx 32rpx;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 36rpx;
  font-weight: 600;
}

.order-stats {
  display: flex;
  align-items: center;
}

.stats-text {
  font-size: 24rpx;
  opacity: 0.9;
}

.tabs-container {
  background: white;
  padding: 0 32rpx;
  border-bottom: 1px solid #f0f0f0;
}

.tabs {
  display: flex;
  align-items: center;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
  position: relative;
  cursor: pointer;
}

.tab-item.active {
  color: #F5A623;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background: #F5A623;
  border-radius: 2rpx;
}

.tab-text {
  font-size: 28rpx;
  font-weight: 500;
}

.tab-badge {
  background: #F5A623;
  color: white;
  font-size: 20rpx;
  padding: 4rpx 8rpx;
  border-radius: 12rpx;
  margin-top: 8rpx;
  min-width: 32rpx;
  text-align: center;
}

.order-list {
  padding: 32rpx;
}

.empty-state {
  text-align: center;
  padding: 120rpx 32rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 32rpx;
  opacity: 0.6;
}

.empty-title {
  display: block;
  font-size: 32rpx;
  color: #666;
  margin-bottom: 16rpx;
}

.empty-desc {
  display: block;
  font-size: 28rpx;
  color: #999;
  margin-bottom: 48rpx;
}

.create-btn {
  width: 300rpx;
}

.order-card {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 24rpx;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.order-number {
  font-size: 24rpx;
  color: #666;
}

.status-badge {
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
  font-weight: 500;
}

.status-pending {
  background: #FFF7E6;
  color: #F5A623;
}

.status-serving {
  background: #E6F7FF;
  color: #1890FF;
}

.status-completed {
  background: #F6FFED;
  color: #52C41A;
}

.status-cancelled {
  background: #FFF1F0;
  color: #FF4D4F;
}

.order-time {
  text-align: right;
}

.time-label {
  display: block;
  font-size: 20rpx;
  color: #999;
  margin-bottom: 4rpx;
}

.time-value {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.card-body {
  padding: 24rpx;
}

.pet-info,
.feeder-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.pet-avatar,
.feeder-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #F5A623 0%, #FFB74D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}

.pet-details,
.feeder-details {
  flex: 1;
}

.pet-name,
.feeder-name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 4rpx;
}

.pet-type,
.feeder-title {
  font-size: 24rpx;
  color: #999;
}

.service-info {
  border-top: 1px solid #f0f0f0;
  padding-top: 24rpx;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.service-item:last-child {
  margin-bottom: 0;
}

.service-label {
  font-size: 24rpx;
  color: #666;
}

.service-value {
  font-size: 24rpx;
  color: #333;
  max-width: 300rpx;
  text-align: right;
  word-break: break-all;
}

.card-footer {
  padding: 24rpx;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.price-label {
  font-size: 24rpx;
  color: #666;
}

.price-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #F5A623;
}

.action-buttons {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  min-width: 120rpx;
}
</style>
