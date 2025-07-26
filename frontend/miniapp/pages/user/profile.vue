<template>
  <view class="container">
    <!-- 用户信息头部 -->
    <view class="user-header">
      <view class="header-bg"></view>
      <view class="user-info">
        <view class="avatar-section">
          <view class="avatar-wrapper" @click="changeAvatar">
            <image 
              v-if="user?.avatar" 
              :src="user.avatar" 
              mode="aspectFill"
              class="user-avatar"
            />
            <view v-else class="avatar-placeholder">
              <text class="placeholder-text">{{ user?.nickname?.charAt(0) || '👤' }}</text>
            </view>
            <view class="avatar-edit">
              <text class="edit-icon">📷</text>
            </view>
          </view>
        </view>
        
        <view class="user-details">
          <text class="user-name">{{ user?.nickname || '未设置昵称' }}</text>
          <text class="user-phone">{{ formatPhone(user?.phone) }}</text>
          <view class="user-level">
            <text class="level-icon">⭐</text>
            <text class="level-text">普通会员</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats-section">
      <view class="stats-grid">
        <view class="stat-item" @click="goToPets">
          <text class="stat-number">{{ petCount }}</text>
          <text class="stat-label">我的宠物</text>
        </view>
        <view class="stat-item" @click="goToOrders">
          <text class="stat-number">{{ orderCount }}</text>
          <text class="stat-label">服务订单</text>
        </view>
        <view class="stat-item" @click="goToFavorites">
          <text class="stat-number">{{ favoriteCount }}</text>
          <text class="stat-label">收藏服务</text>
        </view>
        <view class="stat-item" @click="goToCoupons">
          <text class="stat-number">{{ couponCount }}</text>
          <text class="stat-label">优惠券</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <!-- 我的服务 -->
      <view class="menu-group">
        <view class="group-title">我的服务</view>
        <view class="menu-list">
          <view class="menu-item" @click="goToOrders">
            <view class="menu-icon">📋</view>
            <text class="menu-text">我的订单</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="goToPets">
            <view class="menu-icon">🐾</view>
            <text class="menu-text">我的宠物</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="goToSchedule">
            <view class="menu-icon">📅</view>
            <text class="menu-text">预约记录</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="goToFavorites">
            <view class="menu-icon">❤️</view>
            <text class="menu-text">我的收藏</text>
            <text class="menu-arrow">></text>
          </view>
        </view>
      </view>

      <!-- 账户管理 -->
      <view class="menu-group">
        <view class="group-title">账户管理</view>
        <view class="menu-list">
          <view class="menu-item" @click="goToWallet">
            <view class="menu-icon">💰</view>
            <text class="menu-text">我的钱包</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="goToCoupons">
            <view class="menu-icon">🎫</view>
            <text class="menu-text">优惠券</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="goToAddress">
            <view class="menu-icon">📍</view>
            <text class="menu-text">地址管理</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="goToSettings">
            <view class="menu-icon">⚙️</view>
            <text class="menu-text">设置</text>
            <text class="menu-arrow">></text>
          </view>
        </view>
      </view>

      <!-- 帮助与反馈 -->
      <view class="menu-group">
        <view class="group-title">帮助与反馈</view>
        <view class="menu-list">
          <view class="menu-item" @click="goToFeedback">
            <view class="menu-icon">💬</view>
            <text class="menu-text">意见反馈</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="goToHelp">
            <view class="menu-icon">❓</view>
            <text class="menu-text">帮助中心</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="contactService">
            <view class="menu-icon">📞</view>
            <text class="menu-text">联系客服</text>
            <text class="menu-arrow">></text>
          </view>
          <view class="menu-item" @click="goToAbout">
            <view class="menu-icon">ℹ️</view>
            <text class="menu-text">关于我们</text>
            <text class="menu-arrow">></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <t-button 
        theme="light" 
        size="large"
        @click="logout"
        class="logout-btn"
      >
        退出登录
      </t-button>
    </view>
  </view>
</template>

<script>
import store from '@/store'
import { request } from '@/utils/request'
import { Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 't-button': Button },
  data() {
    return {
      petCount: 0,
      orderCount: 0,
      favoriteCount: 0,
      couponCount: 0
    }
  },
  computed: {
    user() {
      return store.state.user
    }
  },
  onShow() {
    this.loadUserStats()
  },
  methods: {
    async loadUserStats() {
      try {
        // 获取统计数据
        const [pets, orders, favorites, coupons] = await Promise.all([
          request({ url: '/pets' }),
          request({ url: '/orders' }),
          request({ url: '/favorites' }),
          request({ url: '/coupons' })
        ])
        
        this.petCount = pets.length
        this.orderCount = orders.length
        this.favoriteCount = favorites.length
        this.couponCount = coupons.length
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },
    formatPhone(phone) {
      if (!phone) return '未绑定手机号'
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },
    changeAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          try {
            // 这里应该先上传图片到服务器，然后更新用户信息
            const avatarUrl = res.tempFilePaths[0]
            await request({
              url: '/users/profile',
              method: 'PUT',
              data: { avatar: avatarUrl }
            })
            
            // 更新本地用户信息
            store.commit('setUser', { ...this.user, avatar: avatarUrl })
            
            uni.showToast({ title: '头像更新成功' })
          } catch (error) {
            uni.showToast({ 
              title: '头像更新失败', 
              icon: 'none' 
            })
          }
        }
      })
    },
    goToPets() {
      uni.navigateTo({ url: '/pages/pets/list' })
    },
    goToOrders() {
      uni.navigateTo({ url: '/pages/order/index' })
    },
    goToFavorites() {
      uni.navigateTo({ url: '/pages/favorites/index' })
    },
    goToCoupons() {
      uni.navigateTo({ url: '/pages/coupons/index' })
    },
    goToSchedule() {
      uni.navigateTo({ url: '/pages/schedule/index' })
    },
    goToWallet() {
      uni.navigateTo({ url: '/pages/wallet/index' })
    },
    goToAddress() {
      uni.navigateTo({ url: '/pages/address/index' })
    },
    goToSettings() {
      uni.navigateTo({ url: '/pages/settings/index' })
    },
    goToFeedback() {
      uni.navigateTo({ url: '/pages/feedback/index' })
    },
    goToHelp() {
      uni.navigateTo({ url: '/pages/help/index' })
    },
    goToAbout() {
      uni.navigateTo({ url: '/pages/about/index' })
    },
    contactService() {
      uni.makePhoneCall({
        phoneNumber: '400-123-4567',
        success: () => {
          console.log('拨打电话成功')
        },
        fail: () => {
          uni.showToast({ 
            title: '拨打电话失败', 
            icon: 'none' 
          })
        }
      })
    },
    logout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            store.commit('setToken', '')
            store.commit('setUser', null)
            uni.reLaunch({ url: '/pages/login/index' })
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

.user-header {
  position: relative;
  height: 400rpx;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #F5A623 0%, #FFB74D 100%);
}

.user-info {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 80rpx 32rpx 40rpx;
  color: white;
}

.avatar-section {
  margin-right: 32rpx;
}

.avatar-wrapper {
  position: relative;
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-avatar {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-text {
  font-size: 48rpx;
  font-weight: bold;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32rpx;
  height: 32rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-icon {
  font-size: 16rpx;
}

.user-details {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.user-phone {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
  margin-bottom: 16rpx;
}

.user-level {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.level-icon {
  font-size: 20rpx;
}

.level-text {
  font-size: 20rpx;
  opacity: 0.9;
}

.stats-section {
  margin: -40rpx 32rpx 32rpx;
  position: relative;
  z-index: 2;
}

.stats-grid {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.stat-item {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item:active {
  transform: scale(0.95);
}

.stat-number {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #F5A623;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 20rpx;
  color: #666;
}

.menu-section {
  padding: 0 32rpx;
}

.menu-group {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.group-title {
  padding: 24rpx 32rpx 16rpx;
  font-size: 24rpx;
  color: #999;
  font-weight: 500;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background-color: #f8f9fa;
}

.menu-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  margin-right: 24rpx;
}

.menu-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.menu-arrow {
  font-size: 24rpx;
  color: #ccc;
}

.logout-section {
  padding: 32rpx;
  margin-top: 48rpx;
}

.logout-btn {
  width: 100%;
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.logout-btn:hover {
  background-color: #fff1f0;
}
</style>
