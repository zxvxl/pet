<template>
  <view class="container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">意见反馈</text>
        <text class="page-subtitle">您的建议是我们进步的动力</text>
      </view>
    </view>

    <!-- 反馈表单 -->
    <view class="form-container">
      <!-- 反馈类型 -->
      <view class="form-section">
        <view class="section-title">反馈类型</view>
        <view class="type-selector">
          <view 
            v-for="type in feedbackTypes" 
            :key="type.id"
            :class="['type-item', { active: selectedType === type.id }]"
            @click="selectType(type.id)"
          >
            <text class="type-icon">{{ type.icon }}</text>
            <text class="type-text">{{ type.name }}</text>
          </view>
        </view>
      </view>

      <!-- 反馈内容 -->
      <view class="form-section">
        <view class="section-title">反馈内容</view>
        <view class="content-input">
          <t-textarea 
            v-model="content"
            placeholder="请详细描述您遇到的问题或建议..."
            :maxlength="500"
            :autosize="{ minHeight: 200, maxHeight: 400 }"
            class="feedback-textarea"
          />
          <view class="char-count">
            <text class="count-text">{{ content.length }}/500</text>
          </view>
        </view>
      </view>

      <!-- 联系方式 -->
      <view class="form-section">
        <view class="section-title">联系方式（选填）</view>
        <view class="contact-input">
          <t-input 
            v-model="contact"
            placeholder="请留下您的手机号或邮箱，方便我们回复"
            :maxlength="50"
            class="contact-field"
          />
        </view>
      </view>

      <!-- 图片上传 -->
      <view class="form-section">
        <view class="section-title">上传图片（选填）</view>
        <view class="upload-content">
          <view class="upload-tips">
            <text class="tips-text">上传相关截图，帮助我们更好地理解问题（最多3张）</text>
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
              v-if="images.length < 3"
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
        提交反馈
      </t-button>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { Textarea, Input, Button } from 'tdesign-miniprogram/vue'

export default {
  components: { 
    't-textarea': Textarea,
    't-input': Input,
    't-button': Button
  },
  data() {
    return {
      selectedType: '',
      content: '',
      contact: '',
      images: [],
      submitting: false,
      feedbackTypes: [
        { id: 'bug', name: '功能异常', icon: '🐛' },
        { id: 'suggestion', name: '功能建议', icon: '💡' },
        { id: 'experience', name: '体验问题', icon: '😔' },
        { id: 'other', name: '其他', icon: '📝' }
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.selectedType && this.content.trim().length > 0
    }
  },
  methods: {
    selectType(typeId) {
      this.selectedType = typeId
    },
    chooseImages() {
      const remaining = 3 - this.images.length
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
          title: '请完善反馈信息', 
          icon: 'none' 
        })
        return
      }

      this.submitting = true
      try {
        const feedbackData = {
          type: this.selectedType,
          content: this.content,
          contact: this.contact,
          images: this.images
        }

        await request({
          url: '/feedback',
          method: 'POST',
          data: feedbackData
        })

        uni.showToast({ title: '反馈提交成功' })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({ 
          title: '反馈提交失败', 
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

.form-section {
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

.type-selector {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.type-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-item.active {
  border-color: #F5A623;
  background: #FFF7E6;
}

.type-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.type-text {
  font-size: 24rpx;
  color: #333;
  font-weight: 500;
}

.content-input {
  position: relative;
}

.feedback-textarea {
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

.contact-input {
  width: 100%;
}

.contact-field {
  width: 100%;
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