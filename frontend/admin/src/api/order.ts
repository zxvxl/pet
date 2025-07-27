// frontend/admin/src/api/orders.ts
// 订单管理相关API接口

import { Alova as http } from '@/utils/http/alova'

// 订单信息类型
export interface OrderInfo {
  id: number
  order_no?: string
  user_id: number
  user?: {
    id: number
    nickname: string
    phone: string
  }
  pet_id?: number
  pet?: {
    id: number
    name: string
    species: string
  }
  feeder_id?: number
  feeder?: {
    id: number
    name: string
    phone: string
  }
  service_type?: string
  service_name?: string
  start_time: string
  end_time?: string
  service_date?: string
  service_time?: string
  service_address?: string
  status: string
  total_price: number
  payment_method?: string
  pay_time?: string
  remark?: string
  created_at: string
  updated_at: string
}

// 订单列表查询参数
export interface OrderListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  dateRange?: [string, string]
  user_id?: number
  feeder_id?: number
}

// 订单统计数据
export interface OrderStats {
  totalOrders: number
  todayOrders: number
  pendingOrders: number
  completedOrders: number
  totalAmount: number
  todayAmount: number
  completionRate: number
  avgOrderAmount: number
}

// 订单状态更新
export interface UpdateOrderStatusDto {
  orderId: number
  status: string
  reason?: string
}

/**
 * 获取订单列表
 */
export function getOrderList(params: OrderListParams) {
  return http.Get('/admin/order', { params })
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id: number) {
  return http.Get(`/admin/order/${id}`)
}

/**
 * 获取订单统计
 */
export function getOrderStats() {
  return http.Get('/admin/order/stats')
}

/**
 * 更新订单状态
 */
export function updateOrderStatus(data: UpdateOrderStatusDto) {
  return http.Post('/admin/order/update-status', data)
}

/**
 * 导出订单数据
 */
export function exportOrders(params: OrderListParams) {
  return http.request({ url: '/admin/order/export', method: 'GET', params, config: { responseType: 'blob' } })
}

/**
 * 获取订单时间轴
 */
export function getOrderTimeline(id: number) {
  return http.Get(`/admin/order/${id}/timeline`)
}

/**
 * 分配喂养员
 */
export function assignFeeder(orderId: number, feederId: number) {
  return http.Post(`/admin/order/${orderId}/assign`, { feederId })
}

/**
 * 取消订单
 */
export function cancelOrder(id: number, reason: string) {
  return http.Post(`/admin/order/${id}/cancel`, { reason })
}

/**
 * 获取喂养员订单列表
 */
export function getFeederOrders(params: OrderListParams) {
  return http.Get('/admin/feeder-order', { params })
}

/**
 * 获取预约订单列表
 */
export function getReserveOrders(params: OrderListParams) {
  return http.Get('/admin/reserve-orders', { params })
}