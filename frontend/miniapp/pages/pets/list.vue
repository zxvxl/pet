<template>
  <view class="container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">我的宠物</text>
        <view class="pet-count">
          <text class="count-number">{{ pets.length }}</text>
          <text class="count-text">只宠物</text>
        </view>
      </view>
    </view>

    <!-- 宠物列表 -->
    <view class="pet-list">
      <view v-if="pets.length === 0" class="empty-state">
        <view class="empty-icon">🐾</view>
        <text class="empty-title">还没有添加宠物</text>
        <text class="empty-desc">添加您的第一个宠物朋友吧</text>
        <t-button theme="primary" size="large" @click="goAdd" class="add-btn">
          添加宠物
        </t-button>
      </view>

      <view v-else>
        <view 
          v-for="pet in pets" 
          :key="pet.id" 
          class="pet-card"
          @click="goEdit(pet.id)"
        >
          <view class="card-header">
            <view class="pet-avatar">
              <image 
                v-if="pet.avatar" 
                :src="pet.avatar" 
                mode="aspectFill"
                class="avatar-image"
              />
              <view v-else class="avatar-placeholder">
                <text class="placeholder-text">{{ pet.name.charAt(0) }}</text>
              </view>
            </view>
            
            <view class="pet-info">
              <view class="pet-name">{{ pet.name }}</view>
              <view class="pet-details">
                <view class="detail-item">
                  <text class="detail-label">品种：</text>
                  <text class="detail-value">{{ pet.type || '未知' }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">性别：</text>
                  <text class="detail-value">{{ pet.gender === 0 ? '公' : '母' }}</text>
                </view>
                <view class="detail-item">
                  <text class="detail-label">年龄：</text>
                  <text class="detail-value">{{ pet.age || 0 }}岁</text>
                </view>
              </view>
            </view>

            <view class="card-actions">
              <t-button 
                theme="light" 
                size="small" 
                @click.stop="goEdit(pet.id)"
                class="action-btn"
              >
                编辑
              </t-button>
              <t-button 
                theme="danger" 
                size="small" 
                @click.stop="deletePet(pet.id)"
                class="action-btn"
              >
                删除
              </t-button>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 悬浮添加按钮 -->
    <view v-if="pets.length > 0" class="floating-add">
      <t-button 
        theme="primary" 
        size="large"
        shape="round"
        @click="goAdd"
        class="add-float-btn"
      >
        <text class="add-icon">+</text>
        <text>添加宠物</text>
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
      pets: [],
      loading: false
    }
  },
  onShow() {
    this.fetchPets()
  },
  methods: {
    async fetchPets() {
      this.loading = true
      try {
        const res = await request({ url: '/pets' })
        this.pets = res
      } catch (error) {
        uni.showToast({ 
          title: '获取宠物列表失败', 
          icon: 'none' 
      })
      } finally {
        this.loading = false
      }
    },
    goAdd() {
      uni.navigateTo({ url: '/pages/pets/edit' })
    },
    goEdit(id) {
      uni.navigateTo({ url: `/pages/pets/edit?id=${id}` })
    },
    async deletePet(id) {
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这只宠物吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              await request({ 
                url: `/pets/${id}`, 
                method: 'DELETE' 
              })
              uni.showToast({ title: '删除成功' })
              this.fetchPets()
            } catch (error) {
              uni.showToast({ 
                title: '删除失败', 
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
  padding-bottom: 120rpx;
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

.pet-count {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.count-number {
  font-size: 48rpx;
  font-weight: bold;
}

.count-text {
  font-size: 24rpx;
  opacity: 0.9;
}

.pet-list {
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

.add-btn {
  width: 300rpx;
}

.pet-card {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.pet-card:active {
  transform: scale(0.98);
}

.card-header {
  display: flex;
  align-items: center;
  padding: 32rpx;
  gap: 24rpx;
}

.pet-avatar {
  width: 120rpx;
  height: 120rpx;
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
  font-size: 48rpx;
  font-weight: bold;
  color: white;
}

.pet-info {
  flex: 1;
  min-width: 0;
}

.pet-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 16rpx;
}

.pet-details {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-label {
  font-size: 24rpx;
  color: #999;
  width: 80rpx;
}

.detail-value {
  font-size: 24rpx;
  color: #666;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.action-btn {
  min-width: 120rpx;
}

.floating-add {
  position: fixed;
  bottom: 48rpx;
  right: 48rpx;
  z-index: 1000;
}

.add-float-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 24rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(245, 166, 35, 0.3);
}

.add-icon {
  font-size: 32rpx;
  font-weight: bold;
}
</style>
