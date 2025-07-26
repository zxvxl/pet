
// design an edit pet profile page using TDesign form and image component, with save and cancel buttons at the bottom

<template>
  <view class="container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">{{ isEdit ? '编辑宠物' : '添加宠物' }}</text>
        <text class="page-subtitle">{{ isEdit ? '修改宠物信息' : '添加新的宠物朋友' }}</text>
      </view>
    </view>

    <!-- 表单内容 -->
    <view class="form-container">
      <!-- 头像上传 -->
      <view class="avatar-section">
        <view class="avatar-upload" @click="chooseAvatar">
          <image 
            v-if="form.avatar" 
            :src="form.avatar" 
            mode="aspectFill"
            class="avatar-image"
          />
          <view v-else class="avatar-placeholder">
            <text class="upload-icon">📷</text>
            <text class="upload-text">点击上传头像</text>
          </view>
        </view>
      </view>

      <!-- 基本信息 -->
      <view class="form-section">
        <view class="section-title">基本信息</view>
        
        <view class="form-item">
          <text class="form-label">宠物名字 *</text>
          <t-input 
            v-model="form.name" 
            placeholder="请输入宠物名字"
            :maxlength="20"
            class="form-input"
          />
        </view>

    <view class="form-item">
          <text class="form-label">宠物品种</text>
          <t-input 
            v-model="form.type" 
            placeholder="请输入宠物品种"
            :maxlength="30"
            class="form-input"
          />
    </view>

    <view class="form-item">
          <text class="form-label">性别</text>
          <t-picker 
            :columns="genderOptions" 
            @change="changeGender"
            class="form-picker"
          >
            <t-input 
              readonly 
              :value="genderText" 
              placeholder="请选择性别"
              class="form-input"
            />
      </t-picker>
        </view>

        <view class="form-item">
          <text class="form-label">年龄</text>
          <t-input 
            v-model="form.age" 
            placeholder="请输入年龄"
            type="number"
            :maxlength="3"
            class="form-input"
          />
          <text class="form-unit">岁</text>
        </view>

        <view class="form-item">
          <text class="form-label">生日</text>
          <t-date-picker 
            mode="date"
            @change="changeBirthday"
            class="form-picker"
          >
            <t-input 
              readonly 
              :value="form.birthday || ''" 
              placeholder="请选择生日"
              class="form-input"
            />
          </t-date-picker>
        </view>
      </view>

      <!-- 详细信息 -->
      <view class="form-section">
        <view class="section-title">详细信息</view>
        
        <view class="form-item">
          <text class="form-label">体重</text>
          <t-input 
            v-model="form.weight" 
            placeholder="请输入体重"
            type="digit"
            :maxlength="6"
            class="form-input"
          />
          <text class="form-unit">kg</text>
        </view>

        <view class="form-item">
          <text class="form-label">颜色</text>
          <t-input 
            v-model="form.color" 
            placeholder="请输入毛色"
            :maxlength="20"
            class="form-input"
          />
        </view>

        <view class="form-item">
          <text class="form-label">备注</text>
          <t-textarea 
            v-model="form.remark" 
            placeholder="请输入备注信息"
            :maxlength="200"
            :autosize="{ minHeight: 120, maxHeight: 200 }"
            class="form-textarea"
          />
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
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
        class="submit-btn"
      >
        {{ isEdit ? '保存修改' : '添加宠物' }}
      </t-button>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { 
  Input, 
  Button, 
  Picker, 
  DatePicker, 
  Textarea 
} from 'tdesign-miniprogram/vue'

export default {
  components: { 
    't-input': Input, 
    't-button': Button, 
    't-picker': Picker,
    't-date-picker': DatePicker,
    't-textarea': Textarea
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        type: '',
        gender: '',
        age: '',
        birthday: '',
        weight: '',
        color: '',
        remark: '',
        avatar: ''
      },
      genderOptions: ['公', '母'],
      submitting: false
    }
  },
  computed: {
    isEdit() {
      return !!this.form.id
    },
    genderText() {
      return this.form.gender !== '' ? this.genderOptions[this.form.gender] : '请选择性别'
    }
  },
  onLoad(options) {
    if (options.id) {
      this.form.id = options.id
      this.loadPet()
    }
  },
  methods: {
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.form.avatar = res.tempFilePaths[0]
        }
      })
    },
    changeGender(e) {
      this.form.gender = e.detail.value
    },
    changeBirthday(e) {
      this.form.birthday = e.detail.value
    },
    async loadPet() {
      try {
        const res = await request({ url: `/pets/${this.form.id}` })
        this.form = { ...this.form, ...res }
      } catch (error) {
        uni.showToast({ 
          title: '获取宠物信息失败', 
          icon: 'none' 
        })
      }
    },
    async submit() {
      if (!this.form.name.trim()) {
        uni.showToast({ 
          title: '请输入宠物名字', 
          icon: 'none' 
        })
        return
      }

      this.submitting = true
      try {
        const method = this.isEdit ? 'PUT' : 'POST'
        const url = this.isEdit ? `/pets/${this.form.id}` : '/pets'
        
        await request({ 
          url, 
          method, 
          data: this.form 
        })
        
        uni.showToast({ 
          title: this.isEdit ? '修改成功' : '添加成功' 
        })
        
        setTimeout(() => {
        uni.navigateBack()
        }, 1500)
      } catch (error) {
        uni.showToast({ 
          title: this.isEdit ? '修改失败' : '添加失败', 
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

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 48rpx;
}

.avatar-upload {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 4rpx dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-upload:active {
  transform: scale(0.95);
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.upload-icon {
  font-size: 48rpx;
  opacity: 0.6;
}

.upload-text {
  font-size: 20rpx;
  color: #999;
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

.form-item {
  margin-bottom: 32rpx;
  position: relative;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 26rpx;
  color: #333;
  margin-bottom: 12rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
}

.form-picker {
  width: 100%;
}

.form-textarea {
  width: 100%;
}

.form-unit {
  position: absolute;
  right: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24rpx;
  color: #999;
  pointer-events: none;
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
