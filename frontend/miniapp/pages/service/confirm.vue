<template>
  <view class="container">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <text class="page-title">确认预约</text>
        <text class="page-subtitle">请确认您的预约信息</text>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view class="section-title">订单信息</view>
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">服务项目</text>
          <text class="info-value">{{ orderInfo.serviceNames }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">服务宠物</text>
          <text class="info-value">{{ orderInfo.petNames }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">服务时间</text>
          <text class="info-value">{{ formatDateTime(orderInfo.date, orderInfo.time) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">服务地址</text>
          <text class="info-value">{{ orderInfo.address }}</text>
        </view>
        <view class="info-item" v-if="orderInfo.remark">
          <text class="info-label">备注信息</text>
          <text class="info-value">{{ orderInfo.remark }}</text>
        </view>
      </view>
    </view>

    <!-- 支付方式 -->
    <view class="payment-method">
      <view class="section-title">支付方式</view>
      <view class="method-list">
        <view 
          v-for="method in paymentMethods" 
          :key="method.id"
          :class="['method-item', { selected: selectedPayment === method.id }]"
          @click="selectPayment(method.id)"
        >
          <view class="method-icon">
            <text class="icon-text">{{ method.icon }}</text>
          </view>
          <view class="method-info">
            <text class="method-name">{{ method.name }}</text>
            <text class="method-desc">{{ method.desc }}</text>
          </view>
          <view class="method-radio">
            <view class="radio-circle" :class="{ active: selectedPayment === method.id }">
              <view v-if="selectedPayment === method.id" class="radio-dot"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 优惠券 -->
    <view class="coupon-section">
      <view class="section-header">
        <text class="section-title">优惠券</text>
        <text class="coupon-count" v-if="availableCoupons.length > 0">
          {{ availableCoupons.length }}张可用
        </text>
      </view>
      
      <view v-if="availableCoupons.length === 0" class="no-coupon">
        <text class="no-coupon-text">暂无可用优惠券</text>
      </view>
      
      <view v-else class="coupon-list">
        <view 
          v-for="coupon in availableCoupons" 
          :key="coupon.id"
          :class="['coupon-item', { selected: selectedCoupon === coupon.id }]"
          @click="selectCoupon(coupon.id)"
        >
          <view class="coupon-left">
            <view class="coupon-amount">
              <text class="amount-symbol">¥</text>
              <text class="amount-value">{{ coupon.amount }}</text>
            </view>
            <view class="coupon-condition">
              <text class="condition-text">满{{ coupon.minAmount }}可用</text>
            </view>
          </view>
          <view class="coupon-right">
            <text class="coupon-name">{{ coupon.name }}</text>
            <text class="coupon-desc">{{ coupon.description }}</text>
            <text class="coupon-expire">有效期至{{ formatDate(coupon.expireDate) }}</text>
          </view>
          <view class="coupon-radio">
            <view class="radio-circle" :class="{ active: selectedCoupon === coupon.id }">
              <view v-if="selectedCoupon === coupon.id" class="radio-dot"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 价格明细 -->
    <view class="price-detail">
      <view class="section-title">价格明细</view>
      <view class="price-list">
        <view class="price-item">
          <text class="price-label">服务费用</text>
          <text class="price-value">¥{{ originalPrice }}</text>
        </view>
        <view class="price-item" v-if="couponDiscount > 0">
          <text class="price-label">优惠券</text>
          <text class="price-value discount">-¥{{ couponDiscount }}</text>
        </view>
        <view class="price-divider"></view>
        <view class="price-item total">
          <text class="price-label">实付金额</text>
          <text class="price-value total-price">¥{{ finalPrice }}</text>
        </view>
      </view>
    </view>

    <!-- 服务协议 -->
    <view class="agreement-section">
      <view class="agreement-item">
        <view class="checkbox-wrapper" @click="toggleAgreement">
          <view class="checkbox" :class="{ checked: agreementChecked }">
            <text v-if="agreementChecked" class="check-icon">✓</text>
          </view>
        </view>
        <text class="agreement-text">
          我已阅读并同意
          <text class="link-text" @click="viewAgreement">《服务协议》</text>
          和
          <text class="link-text" @click="viewPrivacy">《隐私政策》</text>
        </text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <view class="price-info">
        <text class="price-label">实付金额</text>
        <text class="price-value">¥{{ finalPrice }}</text>
      </view>
      <t-button 
        theme="primary" 
        size="large"
        @click="submitOrder"
        :loading="submitting"
        :disabled="!canSubmit"
        class="submit-btn"
      >
        立即支付
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
      orderData: {},
      orderInfo: {},
      selectedPayment: 'wechat',
      selectedCoupon: '',
      agreementChecked: false,
      submitting: false,
      paymentMethods: [
        {
          id: 'wechat',
          name: '微信支付',
          desc: '推荐使用微信支付',
          icon: '💳'
        },
        {
          id: 'alipay',
          name: '支付宝',
          desc: '安全便捷的支付方式',
          icon: '💰'
        },
        {
          id: 'balance',
          name: '余额支付',
          desc: '使用账户余额支付',
          icon: '💎'
        }
      ],
      availableCoupons: [
        {
          id: 1,
          name: '新用户专享券',
          description: '新用户首次下单专享',
          amount: 20,
          minAmount: 100,
          expireDate: '2024-12-31'
        },
        {
          id: 2,
          name: '满减优惠券',
          description: '满200减30',
          amount: 30,
          minAmount: 200,
          expireDate: '2024-12-31'
        }
      ]
    }
  },
  computed: {
    originalPrice() {
      return this.orderInfo.totalPrice || 0
    },
    couponDiscount() {
      if (!this.selectedCoupon) return 0
      const coupon = this.availableCoupons.find(c => c.id === this.selectedCoupon)
      if (!coupon || this.originalPrice < coupon.minAmount) return 0
      return Math.min(coupon.amount, this.originalPrice)
    },
    finalPrice() {
      return Math.max(0, this.originalPrice - this.couponDiscount)
    },
    canSubmit() {
      return this.agreementChecked && this.finalPrice > 0
    }
  },
  onLoad(options) {
    if (options.data) {
      try {
        this.orderData = JSON.parse(decodeURIComponent(options.data))
        this.processOrderData()
      } catch (error) {
        uni.showToast({ 
          title: '订单数据解析失败', 
          icon: 'none' 
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  },
  methods: {
    async processOrderData() {
      try {
        // 加载订单相关信息
        const [services, pets, address] = await Promise.all([
          request({ 
            url: '/service-types',
            data: { ids: this.orderData.serviceIds }
          }),
          request({ 
            url: '/pets',
            data: { ids: this.orderData.petIds }
          }),
          request({ 
            url: `/addresses/${this.orderData.addressId}` 
          })
        ])

        this.orderInfo = {
          serviceNames: services.map(s => s.name).join('、'),
          petNames: pets.map(p => p.name).join('、'),
          date: this.orderData.date,
          time: this.orderData.time,
          address: address.detail,
          remark: this.orderData.remark,
          totalPrice: this.orderData.totalPrice
        }
      } catch (error) {
        // 使用模拟数据
        this.orderInfo = {
          serviceNames: '宠物喂养、基础护理',
          petNames: '小白、小黑',
          date: this.orderData.date || '2024-01-15',
          time: this.orderData.time || '14:00',
          address: '北京市朝阳区某某街道某某小区1号楼101室',
          remark: this.orderData.remark || '',
          totalPrice: this.orderData.totalPrice || 158
        }
      }
    },
    selectPayment(methodId) {
      this.selectedPayment = methodId
    },
    selectCoupon(couponId) {
      if (this.selectedCoupon === couponId) {
        this.selectedCoupon = ''
      } else {
        this.selectedCoupon = couponId
      }
    },
    toggleAgreement() {
      this.agreementChecked = !this.agreementChecked
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
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}月${day}日`
    },
    viewAgreement() {
      uni.navigateTo({ url: '/pages/agreement/service' })
    },
    viewPrivacy() {
      uni.navigateTo({ url: '/pages/agreement/privacy' })
    },
    async submitOrder() {
      if (!this.canSubmit) {
        uni.showToast({ 
          title: '请确认服务协议', 
          icon: 'none' 
        })
        return
      }

      this.submitting = true
      try {
        const orderParams = {
          ...this.orderData,
          paymentMethod: this.selectedPayment,
          couponId: this.selectedCoupon,
          finalPrice: this.finalPrice
        }

        const result = await request({
          url: '/orders',
          method: 'POST',
          data: orderParams
        })

        // 模拟支付流程
        uni.showLoading({ title: '正在支付...' })
        
        setTimeout(() => {
          uni.hideLoading()
          uni.showToast({ 
            title: '支付成功', 
            icon: 'success' 
          })
          
          setTimeout(() => {
            uni.redirectTo({ 
              url: `/pages/pay/result?orderId=${result.orderId}&status=success` 
            })
          }, 1500)
        }, 2000)

      } catch (error) {
        uni.showToast({ 
          title: '支付失败，请重试', 
          icon: 'none' 
        })
      } finally {
        this.submitting = false
      }
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

.order-info,
.payment-method,
.coupon-section,
.price-detail,
.agreement-section {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.coupon-count {
  font-size: var(--font-size-sm);
  color: var(--brand-primary);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  min-width: 120rpx;
}

.info-value {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  text-align: right;
  flex: 1;
  margin-left: var(--spacing-md);
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.method-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border: 2rpx solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  cursor: pointer;
}

.method-item.selected {
  border-color: var(--brand-primary);
  background: var(--bg-light);
}

.method-icon {
  width: 60rpx;
  height: 60rpx;
  background: var(--bg-light);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
}

.icon-text {
  font-size: var(--font-size-lg);
}

.method-info {
  flex: 1;
}

.method-name {
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.method-desc {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.method-radio {
  margin-left: var(--spacing-md);
}

.radio-circle {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid var(--border-primary);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
}

.radio-circle.active {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
}

.radio-dot {
  width: 16rpx;
  height: 16rpx;
  background: white;
  border-radius: var(--radius-round);
}

.no-coupon {
  text-align: center;
  padding: var(--spacing-xl);
}

.no-coupon-text {
  font-size: var(--font-size-sm);
  color: var(--text-light);
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border: 2rpx solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: var(--transition-normal);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.coupon-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8rpx;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
}

.coupon-item.selected {
  border-color: var(--brand-primary);
  background: var(--bg-light);
}

.coupon-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  padding: var(--spacing-sm);
  margin-right: var(--spacing-md);
}

.coupon-amount {
  display: flex;
  align-items: baseline;
  color: var(--brand-error);
}

.amount-symbol {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.amount-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.coupon-condition {
  margin-top: 4rpx;
}

.condition-text {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.coupon-right {
  flex: 1;
}

.coupon-name {
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: 4rpx;
}

.coupon-desc {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: 4rpx;
}

.coupon-expire {
  font-size: var(--font-size-xs);
  color: var(--text-light);
}

.coupon-radio {
  margin-left: var(--spacing-md);
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

.agreement-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.checkbox-wrapper {
  margin-top: 4rpx;
}

.checkbox {
  width: 32rpx;
  height: 32rpx;
  border: 2rpx solid var(--border-primary);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-normal);
  cursor: pointer;
}

.checkbox.checked {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
}

.check-icon {
  font-size: var(--font-size-sm);
  color: white;
  font-weight: var(--font-weight-bold);
}

.agreement-text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.link-text {
  color: var(--brand-primary);
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

.price-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.price-info .price-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.price-info .price-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--brand-error);
}

.submit-btn {
  min-width: 200rpx;
}
</style>
