<template>
  <view class="container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">服务评价</text>
        <text class="page-subtitle">您的评价对我们很重要</text>
      </view>
    </view>

    <!-- 评价表单 -->
    <view class="form-container">
      <!-- 订单信息 -->
      <view class="order-info-section">
        <view class="section-title">订单信息</view>
        <view class="order-card">
          <view class="order-header">
            <text class="order-number">订单号：{{ orderInfo.id }}</text>
            <text class="order-status">{{ getStatusText(orderInfo.status) }}</text>
          </view>
          <view class="order-details">
            <view class="detail-item">
              <text class="detail-label">服务项目：</text>
              <text class="detail-value">{{ orderInfo.serviceName || '宠物喂养' }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">服务时间：</text>
              <text class="detail-value">{{ formatTime(orderInfo.startTime) }}</text>
            </view>
            <view class="detail-item">
              <text class="detail-label">喂养员：</text>
              <text class="detail-value">{{ orderInfo.feeder?.name || '未分配' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 星级评分 -->
      <view class="rating-section">
        <view class="section-title">服务评分</view>
        <view class="rating-content">
          <text class="rating-label">整体满意度</text>
          <view class="star-rating">
            <view 
              v-for="star in 5" 
              :key="star"
              :class="['star', { active: star <= rating }]"
              @click="setRating(star)"
            >
              ⭐
            </view>
          </view>
          <text class="rating-text">{{ getRatingText() }}</text>
        </view>
      </view>

      <!-- 标签选择 -->
      <view class="tags-section">
        <view class="section-title">服务标签</view>
        <view class="tags-content">
          <view class="tags-group">
            <text class="group-title">服务态度</text>
            <view class="tags-list">
              <view 
                v-for="tag in attitudeTags" 
                :key="tag.id"
                :class="['tag-item', { active: selectedTags.includes(tag.id) }]"
                @click="toggleTag(tag.id)"
              >
                {{ tag.name }}
              </view>
            </view>
          </view>
          
          <view class="tags-group">
            <text class="group-title">服务质量</text>
            <view class="tags-list">
              <view 
                v-for="tag in qualityTags" 
                :key="tag.id"
                :class="['tag-item', { active: selectedTags.includes(tag.id) }]"
                @click="toggleTag(tag.id)"
              >
                {{ tag.name }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 文字评价 -->
      <view class="comment-section">
        <view class="section-title">详细评价</view>
        <view class="comment-content">
          <t-textarea 
            v-model="comment"
            placeholder="请详细描述您的服务体验，帮助我们提供更好的服务..."
            :maxlength="500"
            :autosize="{ minHeight: 200, maxHeight: 400 }"
            class="comment-textarea"
          />
          <view class="char-count">
            <text class="count-text">{{ comment.length }}/500</text>
          </view>
        </view>
      </view>

      <!-- 图片上传 -->
      <view class="upload-section">
        <view class="section-title">上传图片</view>
        <view class="upload-content">
          <view class="upload-tips">
            <text class="tips-text">上传服务过程中的照片（最多9张）</text>
          </view>
          <view class="image-list">
            <view 
              v-for="(image, index) in images" 
              :key="index"
              class="image-item"
            >
              <image 
                :src="image" 
                mode="aspectFill"
                class="uploaded-image"
              />
              <view class="image-delete" @click="deleteImage(index)">
                <text class="delete-icon">×</text>
              </view>
            </view>
            <view 
              v-if="images.length < 9"
              class="upload-button"
              @click="chooseImages"
            >
              <text class="upload-icon">+</text>
              <text class="upload-text">添加图片</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部提交按钮 -->
    <view class="bottom-actions">
      <t-button 
        theme="light" 
        size="large"
        @click="goBack"
        class="cancel-btn"
      >
        取消
      </t-button>
      <t-button 
        theme="primary" 
        size="large"
        @click="submit"
        :loading="submitting"
        :disabled="!canSubmit"
        class="submit-btn"
      >
        提交评价
      </t-button>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { Textarea, Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 
    't-textarea': Textarea,
    't-button': Button
  },
  data() {
    return {
      orderId: '',
      orderInfo: {},
      rating: 0,
      selectedTags: [],
      comment: '',
      images: [],
      submitting: false,
      attitudeTags: [
        { id: 'attitude_1', name: '服务态度好' },
        { id: 'attitude_2', name: '沟通顺畅' },
        { id: 'attitude_3', name: '准时到达' },
        { id: 'attitude_4', name: '专业耐心' }
      ],
      qualityTags: [
        { id: 'quality_1', name: '服务专业' },
        { id: 'quality_2', name: '宠物喜欢' },
        { id: 'quality_3', name: '环境整洁' },
        { id: 'quality_4', name: '超出预期' }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.rating > 0 && this.comment.trim().length > 0
    }
  },
  onLoad(options) {
    this.orderId = options.orderId
    this.loadOrderInfo()
  },
  methods: {
    async loadOrderInfo() {
      try {
        const res = await request({ url: `/orders/${this.orderId}` })
        this.orderInfo = res
      } catch (error) {
        uni.showToast({ 
          title: '获取订单信息失败', 
          icon: 'none' 
        })
      }
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
    setRating(star) {
      this.rating = star
    },
    getRatingText() {
      const texts = ['', '非常不满意', '不满意', '一般', '满意', '非常满意']
      return texts[this.rating] || ''
    },
    toggleTag(tagId) {
      const index = this.selectedTags.indexOf(tagId)
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      } else {
        if (this.selectedTags.length < 6) {
          this.selectedTags.push(tagId)
        } else {
          uni.showToast({ 
            title: '最多选择6个标签', 
            icon: 'none' 
          })
        }
      }
    },
    chooseImages() {
      const remaining = 9 - this.images.length
      uni.chooseImage({
        count: remaining,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.images = [...this.images, ...res.tempFilePaths]
        }
      })
    },
    deleteImage(index) {
      this.images.splice(index, 1)
    },
    async submit() {
      if (!this.canSubmit) {
        uni.showToast({ 
          title: '请完善评价信息', 
          icon: 'none' 
        })
        return
      }

      this.submitting = true
      try {
        const evaluationData = {
          orderId: this.orderId,
          rating: this.rating,
          tags: this.selectedTags,
          comment: this.comment,
          images: this.images
        }

        await request({
          url: '/evaluation',
          method: 'POST',
          data: evaluationData
        })

        uni.showToast({ title: '评价提交成功' })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({ 
          title: '评价提交失败', 
          icon: 'none' 
        })
      } finally {
        this.submitting = false
      }
    },
    goBack() {
      uni.navigateBack()
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
  text-align: center;
}

.page-title {
  display: block;
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.page-subtitle {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
}

.form-container {
  padding: 32rpx;
}

.order-info-section,
.rating-section,
.tags-section,
.comment-section,
.upload-section {
  background: white;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 24rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
}

.order-card {
  background: #f8f9fa;
  border-radius: 12rpx;
  padding: 24rpx;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.order-number {
  font-size: 24rpx;
  color: #666;
}

.order-status {
  font-size: 24rpx;
  color: #F5A623;
  font-weight: 500;
}

.order-details {
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
  color: #666;
  width: 120rpx;
}

.detail-value {
  font-size: 24rpx;
  color: #333;
  flex: 1;
}

.rating-content {
  text-align: center;
}

.rating-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 24rpx;
}

.star-rating {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.star {
  font-size: 48rpx;
  opacity: 0.3;
  cursor: pointer;
  transition: all 0.3s ease;
}

.star.active {
  opacity: 1;
  transform: scale(1.1);
}

.rating-text {
  font-size: 24rpx;
  color: #F5A623;
  font-weight: 500;
}

.tags-content {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.tags-group {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.group-title {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag-item {
  padding: 12rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #666;
  background: #f5f5f5;
  border: 2rpx solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item.active {
  background: #FFF7E6;
  color: #F5A623;
  border-color: #F5A623;
}

.comment-content {
  position: relative;
}

.comment-textarea {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 12rpx;
  padding: 16rpx;
}

.char-count {
  text-align: right;
  margin-top: 8rpx;
}

.count-text {
  font-size: 20rpx;
  color: #999;
}

.upload-tips {
  margin-bottom: 24rpx;
}

.tips-text {
  font-size: 24rpx;
  color: #666;
}

.image-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}

.image-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12rpx;
  overflow: hidden;
}

.uploaded-image {
  width: 100%;
  height: 100%;
}

.image-delete {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 32rpx;
  height: 32rpx;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.delete-icon {
  color: white;
  font-size: 20rpx;
  font-weight: bold;
}

.upload-button {
  width: 100%;
  aspect-ratio: 1;
  border: 2rpx dashed #ddd;
  border-radius: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-button:active {
  transform: scale(0.95);
}

.upload-icon {
  font-size: 48rpx;
  color: #999;
  margin-bottom: 8rpx;
}

.upload-text {
  font-size: 20rpx;
  color: #999;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 24rpx 32rpx;
  display: flex;
  gap: 24rpx;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  flex: 1;
}

.submit-btn {
  flex: 1;
}
</style> 