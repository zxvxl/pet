<template>
  <view class="container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">选择服务</text>
        <text class="page-subtitle">为您的小可爱选择专业服务</text>
      </view>
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view class="filter-tabs">
        <view 
          v-for="category in categories" 
          :key="category.id"
          :class="['filter-tab', { active: selectedCategory === category.id }]"
          @click="selectCategory(category.id)"
        >
          <text class="tab-icon">{{ category.icon }}</text>
          <text class="tab-text">{{ category.name }}</text>
        </view>
      </view>
      
      <view class="sort-options">
        <view class="sort-item" @click="toggleSort">
          <text class="sort-text">{{ sortText }}</text>
          <text class="sort-icon">▼</text>
        </view>
      </view>
    </view>

    <!-- 服务列表 -->
    <view class="service-list">
      <view v-if="filteredServices.length === 0" class="empty-state">
        <view class="empty-icon">🔍</view>
        <text class="empty-title">暂无相关服务</text>
        <text class="empty-desc">试试其他分类或调整筛选条件</text>
        <t-button theme="primary" size="large" @click="resetFilter" class="reset-btn">
          重置筛选
        </t-button>
      </view>
      
      <view v-else>
        <view 
          v-for="service in filteredServices" 
          :key="service.id"
          class="service-card"
          @click="selectService(service)"
        >
          <view class="card-header">
            <image 
              :src="service.coverUrl || '/static/images/service-default.jpg'" 
              mode="aspectFill"
              class="service-cover"
            />
            <view class="service-badge" v-if="service.isHot">
              <text class="badge-text">热门</text>
            </view>
            <view class="service-badge new" v-if="service.isNew">
              <text class="badge-text">新品</text>
            </view>
          </view>
          
          <view class="card-body">
            <view class="service-info">
              <text class="service-name">{{ service.name }}</text>
              <text class="service-desc">{{ service.description }}</text>
            </view>
            
            <view class="service-meta">
              <view class="service-tags">
                <view 
                  v-for="tag in service.tags" 
                  :key="tag"
                  class="tag-item"
                >
                  <text class="tag-text">{{ tag }}</text>
                </view>
              </view>
              
              <view class="service-stats">
                <view class="stat-item">
                  <text class="stat-icon">⭐</text>
                  <text class="stat-text">{{ service.rating || 4.8 }}</text>
                </view>
                <view class="stat-item">
                  <text class="stat-icon">📋</text>
                  <text class="stat-text">{{ service.orderCount || 0 }}单</text>
                </view>
              </view>
            </view>
            
            <view class="service-price">
              <view class="price-info">
                <text class="price-current">¥{{ service.price }}</text>
                <text class="price-original" v-if="service.originalPrice">¥{{ service.originalPrice }}</text>
                <text class="price-unit">/次</text>
              </view>
              <view class="member-price" v-if="service.memberPrice">
                <text class="member-label">会员价</text>
                <text class="member-value">¥{{ service.memberPrice }}</text>
              </view>
            </view>
          </view>
          
          <view class="card-footer">
            <view class="service-features">
              <view class="feature-item" v-if="service.features">
                <text class="feature-icon">✅</text>
                <text class="feature-text">{{ service.features.join(' · ') }}</text>
              </view>
            </view>
            
            <view class="action-buttons">
              <t-button 
                theme="light" 
                size="small"
                @click.stop="viewDetail(service)"
                class="detail-btn"
              >
                详情
              </t-button>
              <t-button 
                theme="primary" 
                size="small"
                @click.stop="addToCart(service)"
                class="select-btn"
              >
                选择
              </t-button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions" v-if="selectedServices.length > 0">
      <view class="selected-info">
        <text class="selected-count">已选择 {{ selectedServices.length }} 项服务</text>
        <text class="selected-price">总计: ¥{{ totalPrice }}</text>
      </view>
      <t-button 
        theme="primary" 
        size="large"
        @click="proceedToNext"
        class="next-btn"
      >
        下一步
      </t-button>
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
      selectedCategory: 'all',
      selectedServices: [],
      sortType: 'default',
      categories: [
        { id: 'all', name: '全部', icon: '🏠' },
        { id: 'feeding', name: '喂养', icon: '🍽️' },
        { id: 'grooming', name: '护理', icon: '🛁' },
        { id: 'boarding', name: '寄养', icon: '🏡' },
        { id: 'medical', name: '医疗', icon: '🏥' }
      ],
      services: [],
      sortOptions: [
        { value: 'default', text: '默认排序' },
        { value: 'price-asc', text: '价格从低到高' },
        { value: 'price-desc', text: '价格从高到低' },
        { value: 'rating', text: '评分最高' },
        { value: 'orders', text: '订单最多' }
      ]
    }
  },
  computed: {
    filteredServices() {
      let filtered = this.services
      
      // 分类筛选
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(service => service.category === this.selectedCategory)
      }
      
      // 排序
      switch (this.sortType) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'orders':
          filtered.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0))
          break
      }
      
      return filtered
    },
    sortText() {
      const option = this.sortOptions.find(opt => opt.value === this.sortType)
      return option ? option.text : '默认排序'
    },
    totalPrice() {
      return this.selectedServices.reduce((total, service) => {
        return total + (service.memberPrice || service.price)
      }, 0)
    }
  },
  onLoad(options) {
    if (options.type) {
      this.selectedCategory = options.type
    }
    this.loadServices()
  },
  methods: {
    async loadServices() {
      try {
        const res = await request({ url: '/service-types' })
        this.services = res.map(service => ({
          ...service,
          isHot: Math.random() > 0.7,
          isNew: Math.random() > 0.8,
          tags: ['专业认证', '上门服务', '安全保障'].slice(0, Math.floor(Math.random() * 3) + 1),
          features: ['24小时服务', '专业工具', '保险保障'].slice(0, Math.floor(Math.random() * 2) + 1)
        }))
      } catch (error) {
        uni.showToast({ 
          title: '加载服务列表失败', 
          icon: 'none' 
        })
      }
    },
    selectCategory(categoryId) {
      this.selectedCategory = categoryId
    },
    toggleSort() {
      const currentIndex = this.sortOptions.findIndex(opt => opt.value === this.sortType)
      const nextIndex = (currentIndex + 1) % this.sortOptions.length
      this.sortType = this.sortOptions[nextIndex].value
    },
    resetFilter() {
      this.selectedCategory = 'all'
      this.sortType = 'default'
    },
    selectService(service) {
      const index = this.selectedServices.findIndex(s => s.id === service.id)
      if (index > -1) {
        this.selectedServices.splice(index, 1)
      } else {
        this.selectedServices.push(service)
      }
    },
    viewDetail(service) {
      uni.navigateTo({ url: `/pages/service/detail?id=${service.id}` })
    },
    addToCart(service) {
      this.selectService(service)
      uni.showToast({ 
        title: '已添加到选择', 
        icon: 'success' 
      })
    },
    proceedToNext() {
      if (this.selectedServices.length === 0) {
        uni.showToast({ 
          title: '请至少选择一个服务', 
          icon: 'none' 
        })
        return
      }
      
      const serviceIds = this.selectedServices.map(s => s.id).join(',')
      uni.navigateTo({ 
        url: `/pages/service/pet-bind?ids=${serviceIds}` 
      })
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

.page-header {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-accent) 100%);
  padding: var(--spacing-xl) var(--spacing-lg);
  color: white;
}

.header-content {
  text-align: center;
}

.page-title {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-xs);
}

.page-subtitle {
  display: block;
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.filter-bar {
  background: var(--bg-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-md);
}

.filter-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
  cursor: pointer;
}

.filter-tab.active {
  background: var(--brand-primary);
  color: white;
}

.tab-icon {
  font-size: var(--font-size-lg);
}

.tab-text {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.sort-options {
  display: flex;
  align-items: center;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-light);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-normal);
}

.sort-item:active {
  transform: scale(0.95);
}

.sort-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.sort-icon {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.service-list {
  padding: var(--spacing-lg);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xxl) var(--spacing-lg);
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: var(--spacing-lg);
  opacity: 0.6;
}

.empty-title {
  display: block;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.empty-desc {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-light);
  margin-bottom: var(--spacing-xl);
}

.reset-btn {
  width: 300rpx;
}

.service-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  box-shadow: var(--shadow-light);
  transition: var(--transition-normal);
}

.service-card:active {
  transform: scale(0.98);
}

.card-header {
  position: relative;
}

.service-cover {
  width: 100%;
  height: 200rpx;
}

.service-badge {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background: var(--brand-error);
  color: white;
  padding: 4rpx var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.service-badge.new {
  background: var(--brand-success);
}

.badge-text {
  font-size: var(--font-size-xs);
}

.card-body {
  padding: var(--spacing-md);
}

.service-info {
  margin-bottom: var(--spacing-md);
}

.service-name {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.service-desc {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag-item {
  background: var(--bg-light);
  padding: 4rpx var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.tag-text {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.service-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.stat-icon {
  font-size: var(--font-size-xs);
}

.stat-text {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.service-price {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--spacing-md);
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.price-current {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--brand-error);
}

.price-original {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  text-decoration: line-through;
}

.price-unit {
  font-size: var(--font-size-sm);
  color: var(--text-light);
}

.member-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.member-label {
  font-size: var(--font-size-xs);
  color: var(--brand-warning);
}

.member-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--brand-warning);
}

.card-footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.service-features {
  flex: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.feature-icon {
  font-size: var(--font-size-xs);
}

.feature-text {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.detail-btn,
.select-btn {
  min-width: 100rpx;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-light);
  box-shadow: var(--shadow-medium);
}

.selected-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.selected-count {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.selected-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--brand-error);
}

.next-btn {
  min-width: 200rpx;
}
</style>
