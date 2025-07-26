<template>
  <view class="container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">选择宠物</text>
        <text class="page-subtitle">为您的宠物选择服务</text>
      </view>
    </view>

    <!-- 服务确认 -->
    <view class="service-confirm">
      <view class="section-title">已选服务</view>
      <view class="service-list">
        <view 
          v-for="service in selectedServices" 
          :key="service.id"
          class="service-item"
        >
          <view class="service-info">
            <text class="service-name">{{ service.name }}</text>
            <text class="service-desc">{{ service.description }}</text>
          </view>
          <view class="service-price">
            <text class="price-value">¥{{ service.memberPrice || service.price }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 宠物选择 -->
    <view class="pet-selection">
      <view class="section-header">
        <text class="section-title">选择宠物</text>
        <text class="section-subtitle">请选择需要服务的宠物</text>
      </view>
      
      <view v-if="pets.length === 0" class="empty-state">
        <view class="empty-icon">🐾</view>
        <text class="empty-title">还没有添加宠物</text>
        <text class="empty-desc">请先添加您的宠物信息</text>
        <t-button theme="primary" size="large" @click="goAddPet" class="add-btn">
          添加宠物
        </t-button>
      </view>
      
      <view v-else class="pet-list">
        <view 
          v-for="pet in pets" 
          :key="pet.id"
          :class="['pet-card', { selected: selectedPets.includes(pet.id) }]"
          @click="togglePet(pet.id)"
        >
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
            <view class="selection-indicator">
              <text class="indicator-icon">{{ selectedPets.includes(pet.id) ? '✓' : '' }}</text>
            </view>
          </view>
          
          <view class="pet-info">
            <text class="pet-name">{{ pet.name }}</text>
            <view class="pet-details">
              <text class="pet-type">{{ pet.type || '未知品种' }}</text>
              <text class="pet-gender">{{ pet.gender === 0 ? '公' : '母' }}</text>
              <text class="pet-age">{{ pet.age || 0 }}岁</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 服务时间 -->
    <view class="time-selection">
      <view class="section-header">
        <text class="section-title">服务时间</text>
        <text class="section-subtitle">选择您希望的服务时间</text>
      </view>
      
      <view class="time-options">
        <view class="date-picker">
          <text class="picker-label">服务日期</text>
          <t-date-picker 
            v-model="selectedDate"
            :min="minDate"
            :max="maxDate"
            @change="onDateChange"
            class="date-input"
          >
            <view class="picker-display">
              <text class="picker-text">{{ formatDate(selectedDate) }}</text>
              <text class="picker-icon">📅</text>
            </view>
          </t-date-picker>
        </view>
        
        <view class="time-picker">
          <text class="picker-label">服务时间</text>
          <t-time-picker 
            v-model="selectedTime"
            :min="minTime"
            :max="maxTime"
            @change="onTimeChange"
            class="time-input"
          >
            <view class="picker-display">
              <text class="picker-text">{{ selectedTime || '请选择时间' }}</text>
              <text class="picker-icon">🕐</text>
            </view>
          </t-time-picker>
        </view>
      </view>
    </view>

    <!-- 服务地址 -->
    <view class="address-selection">
      <view class="section-header">
        <text class="section-title">服务地址</text>
        <text class="section-subtitle">选择服务地点</text>
      </view>
      
      <view class="address-options">
        <view 
          v-for="address in addresses" 
          :key="address.id"
          :class="['address-item', { selected: selectedAddress === address.id }]"
          @click="selectAddress(address.id)"
        >
          <view class="address-icon">📍</view>
          <view class="address-info">
            <text class="address-name">{{ address.name }}</text>
            <text class="address-detail">{{ address.detail }}</text>
          </view>
          <view class="address-default" v-if="address.isDefault">
            <text class="default-text">默认</text>
          </view>
        </view>
        
        <view class="add-address" @click="goAddAddress">
          <view class="add-icon">+</view>
          <text class="add-text">添加新地址</text>
        </view>
      </view>
    </view>

    <!-- 备注信息 -->
    <view class="remark-section">
      <view class="section-header">
        <text class="section-title">备注信息</text>
        <text class="section-subtitle">特殊要求或注意事项</text>
      </view>
      
      <view class="remark-input">
        <t-textarea 
          v-model="remark"
          placeholder="请输入特殊要求或注意事项..."
          :maxlength="200"
          :autosize="{ minHeight: 120, maxHeight: 200 }"
          class="remark-field"
        />
        <view class="char-count">
          <text class="count-text">{{ remark.length }}/200</text>
        </view>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-detail">
      <view class="section-title">价格明细</view>
      <view class="price-list">
        <view class="price-item">
          <text class="price-label">服务费用</text>
          <text class="price-value">¥{{ servicePrice }}</text>
        </view>
        <view class="price-item" v-if="discount > 0">
          <text class="price-label">优惠折扣</text>
          <text class="price-value discount">-¥{{ discount }}</text>
        </view>
        <view class="price-divider"></view>
        <view class="price-item total">
          <text class="price-label">总计</text>
          <text class="price-value total-price">¥{{ totalPrice }}</text>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <view class="action-info">
        <text class="info-text">已选择 {{ selectedPets.length }} 只宠物</text>
        <text class="info-price">¥{{ totalPrice }}</text>
      </view>
      <t-button 
        theme="primary" 
        size="large"
        @click="proceedToConfirm"
        :disabled="!canProceed"
        class="confirm-btn"
      >
        确认预约
      </t-button>
    </view>
  </view>
</template>

<script>
import { request } from '@/utils/request'
import { Button, DatePicker, TimePicker, Textarea } from 'tdesign-miniprogram/vue'

export default {
  components: { 
    't-button': Button,
    't-date-picker': DatePicker,
    't-time-picker': TimePicker,
    't-textarea': Textarea
  },
  data() {
    return {
      serviceIds: [],
      selectedServices: [],
      pets: [],
      selectedPets: [],
      selectedDate: '',
      selectedTime: '',
      addresses: [],
      selectedAddress: '',
      remark: '',
      minDate: '',
      maxDate: '',
      minTime: '08:00',
      maxTime: '20:00'
    }
  },
  computed: {
    servicePrice() {
      return this.selectedServices.reduce((total, service) => {
        return total + (service.memberPrice || service.price)
      }, 0)
    },
    discount() {
      // 模拟优惠计算
      return this.servicePrice > 100 ? Math.floor(this.servicePrice * 0.1) : 0
    },
    totalPrice() {
      return this.servicePrice - this.discount
    },
    canProceed() {
      return this.selectedPets.length > 0 && 
             this.selectedDate && 
             this.selectedTime && 
             this.selectedAddress
    }
  },
  onLoad(options) {
    if (options.ids) {
      this.serviceIds = options.ids.split(',')
    }
    this.initData()
  },
  methods: {
    async initData() {
      this.setDateRange()
      await Promise.all([
        this.loadServices(),
        this.loadPets(),
        this.loadAddresses()
      ])
    },
    setDateRange() {
      const today = new Date()
      this.minDate = this.formatDateForPicker(today)
      
      const maxDate = new Date()
      maxDate.setDate(today.getDate() + 30)
      this.maxDate = this.formatDateForPicker(maxDate)
      
      this.selectedDate = this.minDate
    },
    formatDateForPicker(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    async loadServices() {
      try {
        const res = await request({ 
          url: '/service-types',
          data: { ids: this.serviceIds }
        })
        this.selectedServices = res
      } catch (error) {
        uni.showToast({ 
          title: '加载服务信息失败', 
          icon: 'none' 
        })
      }
    },
    async loadPets() {
      try {
        const res = await request({ url: '/pets' })
        this.pets = res
      } catch (error) {
        uni.showToast({ 
          title: '加载宠物列表失败', 
          icon: 'none' 
        })
      }
    },
    async loadAddresses() {
      try {
        const res = await request({ url: '/addresses' })
        this.addresses = res
        if (res.length > 0) {
          const defaultAddress = res.find(addr => addr.isDefault)
          this.selectedAddress = defaultAddress ? defaultAddress.id : res[0].id
        }
      } catch (error) {
        // 使用模拟数据
        this.addresses = [
          {
            id: 1,
            name: '家庭地址',
            detail: '北京市朝阳区某某街道某某小区1号楼101室',
            isDefault: true
          },
          {
            id: 2,
            name: '公司地址',
            detail: '北京市海淀区某某大厦A座15层',
            isDefault: false
          }
        ]
        this.selectedAddress = 1
      }
    },
    togglePet(petId) {
      const index = this.selectedPets.indexOf(petId)
      if (index > -1) {
        this.selectedPets.splice(index, 1)
      } else {
        this.selectedPets.push(petId)
      }
    },
    onDateChange(date) {
      this.selectedDate = date
    },
    onTimeChange(time) {
      this.selectedTime = time
    },
    selectAddress(addressId) {
      this.selectedAddress = addressId
    },
    formatDate(dateStr) {
      if (!dateStr) return '请选择日期'
      const date = new Date(dateStr)
      const month = date.getMonth() + 1
      const day = date.getDate()
      const weekdays = ['日', '一', '二', '三', '四', '五', '六']
      const weekday = weekdays[date.getDay()]
      return `${month}月${day}日 周${weekday}`
    },
    goAddPet() {
      uni.navigateTo({ url: '/pages/pets/edit' })
    },
    goAddAddress() {
      uni.navigateTo({ url: '/pages/address/index' })
    },
    proceedToConfirm() {
      if (!this.canProceed) {
        uni.showToast({ 
          title: '请完善预约信息', 
          icon: 'none' 
        })
        return
      }
      
      const orderData = {
        serviceIds: this.serviceIds,
        petIds: this.selectedPets,
        date: this.selectedDate,
        time: this.selectedTime,
        addressId: this.selectedAddress,
        remark: this.remark,
        totalPrice: this.totalPrice
      }
      
      uni.navigateTo({ 
        url: `/pages/service/confirm?data=${encodeURIComponent(JSON.stringify(orderData))}` 
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

.service-confirm,
.pet-selection,
.time-selection,
.address-selection,
.remark-section,
.price-detail {
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

.section-header {
  margin-bottom: var(--spacing-lg);
}

.section-subtitle {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--bg-light);
  border-radius: var(--radius-md);
}

.service-info {
  flex: 1;
}

.service-name {
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.service-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.service-price {
  margin-left: var(--spacing-md);
}

.price-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--brand-error);
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

.add-btn {
  width: 300rpx;
}

.pet-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.pet-card {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border: 2rpx solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  cursor: pointer;
}

.pet-card.selected {
  border-color: var(--brand-primary);
  background: var(--bg-light);
}

.pet-avatar {
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

.selection-indicator {
  position: absolute;
  top: -4rpx;
  right: -4rpx;
  width: 24rpx;
  height: 24rpx;
  background: var(--brand-primary);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid var(--bg-primary);
}

.indicator-icon {
  font-size: var(--font-size-xs);
  color: var(--bg-primary);
  font-weight: var(--font-weight-bold);
}

.pet-info {
  flex: 1;
}

.pet-name {
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.pet-details {
  display: flex;
  gap: var(--spacing-sm);
}

.pet-type,
.pet-gender,
.pet-age {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.time-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.date-picker,
.time-picker {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.picker-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.picker-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--bg-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.picker-text {
  font-size: var(--font-size-md);
  color: var(--text-primary);
}

.picker-icon {
  font-size: var(--font-size-md);
  color: var(--text-light);
}

.address-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.address-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border: 2rpx solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  cursor: pointer;
}

.address-item.selected {
  border-color: var(--brand-primary);
  background: var(--bg-light);
}

.address-icon {
  font-size: var(--font-size-lg);
  margin-right: var(--spacing-md);
  color: var(--brand-primary);
}

.address-info {
  flex: 1;
}

.address-name {
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.address-detail {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.address-default {
  margin-left: var(--spacing-md);
}

.default-text {
  font-size: var(--font-size-xs);
  color: var(--brand-primary);
  background: var(--bg-light);
  padding: 4rpx var(--spacing-sm);
  border-radius: var(--radius-sm);
}

.add-address {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  border: 2rpx dashed var(--border-primary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: var(--transition-normal);
}

.add-address:active {
  transform: scale(0.98);
}

.add-icon {
  font-size: var(--font-size-lg);
  color: var(--text-light);
  margin-right: var(--spacing-sm);
}

.add-text {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}

.remark-input {
  position: relative;
}

.remark-field {
  width: 100%;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.char-count {
  text-align: right;
  margin-top: var(--spacing-xs);
}

.count-text {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.price-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-label {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}

.price-value {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.price-value.discount {
  color: var(--brand-success);
}

.price-divider {
  height: 1px;
  background: var(--border-light);
  margin: var(--spacing-sm) 0;
}

.price-item.total {
  margin-top: var(--spacing-sm);
}

.price-item.total .price-label {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
}

.total-price {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--brand-error);
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

.action-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.info-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.info-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--brand-error);
}

.confirm-btn {
  min-width: 200rpx;
}
</style>
