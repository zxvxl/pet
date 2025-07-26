<template>
  <view class="container">
    <!-- 顶部搜索栏 -->
    <view class="search-header">
      <view class="search-bar">
        <view class="search-icon">🔍</view>
        <input 
          class="search-input" 
          placeholder="搜索服务或喂养员"
          @focus="goSearch"
        />
        <view class="location-info" @click="goLocation">
          <text class="location-icon">📍</text>
          <text class="location-text">{{ currentLocation }}</text>
        </view>
      </view>
    </view>

    <!-- 轮播图 -->
    <view class="banner-section">
      <swiper 
        class="banner-swiper" 
        :indicator-dots="true" 
        :autoplay="true" 
        :interval="3000"
        indicator-color="rgba(255, 255, 255, 0.3)"
        indicator-active-color="var(--brand-primary)"
      >
        <swiper-item v-for="banner in banners" :key="banner.id">
          <image 
            :src="banner.image" 
            mode="aspectFill" 
            class="banner-image"
            @click="handleBannerClick(banner)"
          />
        </swiper-item>
      </swiper>
    </view>

    <!-- 快捷服务 -->
    <view class="quick-services">
      <view class="section-header">
        <text class="section-title">快捷服务</text>
        <text class="section-more" @click="goToServices">更多 ></text>
      </view>
      <view class="service-grid">
        <view 
          v-for="service in quickServices" 
          :key="service.id"
          class="service-item"
          @click="selectService(service)"
        >
          <view class="service-icon">
            <text class="icon-text">{{ service.icon }}</text>
          </view>
          <text class="service-name">{{ service.name }}</text>
          <text class="service-desc">{{ service.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 推荐喂养员 -->
    <view class="recommended-feeders">
      <view class="section-header">
        <text class="section-title">推荐喂养员</text>
        <text class="section-more" @click="goToFeeders">查看全部 ></text>
      </view>
      <scroll-view class="feeder-scroll" scroll-x="true">
        <view class="feeder-list">
          <view 
            v-for="feeder in recommendedFeeders" 
            :key="feeder.id"
            class="feeder-card"
            @click="viewFeeder(feeder)"
          >
            <view class="feeder-avatar">
              <image 
                v-if="feeder.avatar" 
                :src="feeder.avatar" 
                mode="aspectFill"
                class="avatar-image"
              />
              <view v-else class="avatar-placeholder">
                <text class="placeholder-text">{{ feeder.name.charAt(0) }}</text>
              </view>
              <view class="online-status" :class="{ online: feeder.online }"></view>
            </view>
            <view class="feeder-info">
              <text class="feeder-name">{{ feeder.name }}</text>
              <view class="feeder-rating">
                <text class="rating-stars">⭐⭐⭐⭐⭐</text>
                <text class="rating-score">{{ feeder.rating }}</text>
              </view>
              <text class="feeder-tags">{{ feeder.tags.join(' · ') }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 热门服务 -->
    <view class="popular-services">
      <view class="section-header">
        <text class="section-title">热门服务</text>
        <text class="section-more" @click="goToServices">更多 ></text>
      </view>
      <view class="service-list">
        <view 
          v-for="service in popularServices" 
          :key="service.id"
          class="service-card"
          @click="viewService(service)"
        >
          <image 
            :src="service.cover" 
            mode="aspectFill" 
            class="service-cover"
          />
          <view class="service-content">
            <text class="service-title">{{ service.name }}</text>
            <text class="service-description">{{ service.description }}</text>
            <view class="service-meta">
              <view class="service-price">
                <text class="price-symbol">¥</text>
                <text class="price-value">{{ service.price }}</text>
                <text class="price-unit">/次</text>
              </view>
              <view class="service-stats">
                <text class="stats-text">{{ service.orderCount }}人已预约</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部快捷入口 -->
    <view class="bottom-actions">
      <view class="action-grid">
        <view class="action-item" @click="goToPets">
          <view class="action-icon">🐾</view>
          <text class="action-text">我的宠物</text>
        </view>
        <view class="action-item" @click="goToOrders">
          <view class="action-icon">📋</view>
          <text class="action-text">我的订单</text>
        </view>
        <view class="action-item" @click="goToChat">
          <view class="action-icon">💬</view>
          <text class="action-text">在线客服</text>
        </view>
        <view class="action-item" @click="goToProfile">
          <view class="action-icon">👤</view>
          <text class="action-text">个人中心</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request'

export default {
  data() {
    return {
      currentLocation: '定位中...',
      banners: [
        {
          id: 1,
          image: '/static/images/banner1.jpg',
          title: '专业宠物喂养服务',
          link: '/pages/service/select'
        },
        {
          id: 2,
          image: '/static/images/banner2.jpg',
          title: '新用户专享优惠',
          link: '/pages/coupons/index'
        }
      ],
      quickServices: [
        {
          id: 1,
          name: '宠物喂养',
          desc: '专业上门喂养',
          icon: '🍽️',
          type: 'feeding'
        },
        {
          id: 2,
          name: '宠物护理',
          desc: '洗澡美容服务',
          icon: '🛁',
          type: 'grooming'
        },
        {
          id: 3,
          name: '宠物寄养',
          desc: '安全舒适环境',
          icon: '🏠',
          type: 'boarding'
        },
        {
          id: 4,
          name: '宠物医疗',
          desc: '健康检查服务',
          icon: '🏥',
          type: 'medical'
        }
      ],
      recommendedFeeders: [
        {
          id: 1,
          name: '张阿姨',
          avatar: '',
          rating: 4.9,
          tags: ['经验丰富', '耐心细致'],
          online: true
        },
        {
          id: 2,
          name: '李师傅',
          avatar: '',
          rating: 4.8,
          tags: ['专业认证', '服务周到'],
          online: true
        },
        {
          id: 3,
          name: '王姐姐',
          avatar: '',
          rating: 4.7,
          tags: ['年轻活力', '沟通顺畅'],
          online: false
        }
      ],
      popularServices: [
        {
          id: 1,
          name: '标准喂养服务',
          description: '包含喂食、换水、清理等基础服务',
          cover: '/static/images/service1.jpg',
          price: 68,
          orderCount: 128
        },
        {
          id: 2,
          name: '豪华护理套餐',
          description: '洗澡、美容、健康检查一站式服务',
          cover: '/static/images/service2.jpg',
          price: 158,
          orderCount: 89
        }
      ]
    }
  },
  onLoad() {
    this.getLocation()
    this.loadHomeData()
  },
  methods: {
    async getLocation() {
      try {
        // 获取用户位置信息
        uni.getLocation({
          type: 'gcj02',
          success: (res) => {
            this.currentLocation = '当前位置'
          },
          fail: () => {
            this.currentLocation = '请开启定位'
          }
        })
      } catch (error) {
        this.currentLocation = '定位失败'
      }
    },
    async loadHomeData() {
      try {
        // 加载首页数据
        const [banners, feeders, services] = await Promise.all([
          request({ url: '/banners' }).catch(() => []),
          request({ url: '/feeders/recommended' }).catch(() => []),
          request({ url: '/services/popular' }).catch(() => [])
        ])
        
        if (banners.length > 0) this.banners = banners
        if (feeders.length > 0) this.recommendedFeeders = feeders
        if (services.length > 0) this.popularServices = services
      } catch (error) {
        console.error('加载首页数据失败:', error)
      }
    },
    goSearch() {
      uni.navigateTo({ url: '/pages/search/index' })
    },
    goLocation() {
      uni.navigateTo({ url: '/pages/location/index' })
    },
    handleBannerClick(banner) {
      if (banner.link) {
        uni.navigateTo({ url: banner.link })
      }
    },
    selectService(service) {
      uni.navigateTo({ 
        url: `/pages/service/select?type=${service.type}` 
      })
    },
    goToServices() {
      uni.navigateTo({ url: '/pages/service/select' })
    },
    goToFeeders() {
      uni.navigateTo({ url: '/pages/feeder/list' })
    },
    viewFeeder(feeder) {
      uni.navigateTo({ url: `/pages/feeder/detail?id=${feeder.id}` })
    },
    viewService(service) {
      uni.navigateTo({ url: `/pages/service/detail?id=${service.id}` })
    },
    goToPets() {
      uni.navigateTo({ url: '/pages/pets/list' })
    },
    goToOrders() {
      uni.navigateTo({ url: '/pages/order/index' })
    },
    goToChat() {
      uni.navigateTo({ url: '/pages/chat/index' })
    },
    goToProfile() {
      uni.navigateTo({ url: '/pages/user/profile' })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: var(--bg-secondary);
  padding-bottom: 120rpx;
}

.search-header {
  background: var(--bg-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
}

.search-bar {
  display: flex;
  align-items: center;
  background: var(--bg-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  gap: var(--spacing-sm);
}

.search-icon {
  font-size: var(--font-size-md);
  color: var(--text-light);
}

.search-input {
  flex: 1;
  font-size: var(--font-size-md);
  color: var(--text-primary);
  background: transparent;
}

.location-info {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding-left: var(--spacing-sm);
  border-left: 1px solid var(--border-light);
}

.location-icon {
  font-size: var(--font-size-sm);
  color: var(--brand-primary);
}

.location-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.banner-section {
  padding: var(--spacing-lg);
}

.banner-swiper {
  height: 300rpx;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-medium);
}

.banner-image {
  width: 100%;
  height: 100%;
}

.quick-services {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.section-more {
  font-size: var(--font-size-sm);
  color: var(--brand-primary);
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  transition: var(--transition-normal);
}

.service-item:active {
  transform: scale(0.95);
}

.service-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
}

.icon-text {
  font-size: 32rpx;
}

.service-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.service-desc {
  font-size: var(--font-size-xs);
  color: var(--text-light);
  text-align: center;
}

.recommended-feeders {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.feeder-scroll {
  white-space: nowrap;
}

.feeder-list {
  display: flex;
  gap: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
}

.feeder-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-light);
  min-width: 280rpx;
  transition: var(--transition-normal);
}

.feeder-card:active {
  transform: scale(0.98);
}

.feeder-avatar {
  position: relative;
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

.online-status {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  width: 16rpx;
  height: 16rpx;
  border-radius: var(--radius-round);
  background: var(--text-light);
  border: 2rpx solid var(--bg-primary);
}

.online-status.online {
  background: var(--brand-success);
}

.feeder-info {
  flex: 1;
  min-width: 0;
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

.feeder-tags {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.popular-services {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.service-card {
  display: flex;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: var(--transition-normal);
}

.service-card:active {
  transform: scale(0.98);
}

.service-cover {
  width: 200rpx;
  height: 150rpx;
  flex-shrink: 0;
}

.service-content {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.service-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.service-description {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-price {
  display: flex;
  align-items: baseline;
  gap: 2rpx;
}

.price-symbol {
  font-size: var(--font-size-sm);
  color: var(--brand-error);
  font-weight: var(--font-weight-medium);
}

.price-value {
  font-size: var(--font-size-lg);
  color: var(--brand-error);
  font-weight: var(--font-weight-bold);
}

.price-unit {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.service-stats {
  display: flex;
  align-items: center;
}

.stats-text {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--border-light);
  box-shadow: var(--shadow-medium);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  transition: var(--transition-normal);
}

.action-item:active {
  transform: scale(0.95);
}

.action-icon {
  width: 60rpx;
  height: 60rpx;
  background: var(--bg-light);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
}

.action-text {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}
</style> 