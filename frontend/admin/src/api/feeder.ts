// frontend/admin/src/api/feeder.ts
// 喂养员管理相关API接口

import { Alova as http } from '@/utils/http/alova'

// 喂养员列表查询参数
export interface FeederListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
  dateRange?: [string, string]
}

// 喂养员信息类型
export interface FeederInfo {
  id: number
  user_id?: number
  name: string
  phone: string
  id_card?: string
  avatar?: string
  address?: string
  bio?: string
  experience?: string
  certificates?: string[]
  status: number
  rating?: number
  order_count?: number
  rejection_reason?: string
  last_login_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// 喂养员审核数据
export interface FeederAuditData {
  id: number
  action: 'approve' | 'reject'
  rejection_reason?: string
}

// 喂养员服务记录
export interface FeederServiceRecord {
  id: number
  feeder_id: number
  order_id: number
  service_type: string
  start_time: string
  end_time?: string
  location?: string
  photos?: string[]
  notes?: string
  rating?: number
  status: string
  created_at: string
}

// 签到记录
export interface FeederCheckin {
  id: number
  feeder_id: number
  order_id: number
  checkin_time: string
  location?: string
  latitude?: number
  longitude?: number
  photos?: string[]
  notes?: string
  created_at: string
}

/**
 * 获取喂养员列表
 */
export function getFeederList(params: FeederListParams) {
  return http.request({
    url: '/admin/feeders',
    method: 'GET',
    params,
  })
}

/**
 * 获取喂养员详情
 */
export function getFeederDetail(id: number) {
  return http.request({
    url: `/admin/feeder/${id}`, 
    method: 'GET',
  })
}

/**
 * 创建喂养员
 */
export function createFeeder(data: Partial<FeederInfo>) {
  return http.request({
    url: '/admin/feeders',
    method: 'POST',
    data,
  })
}

/**
 * 更新喂养员信息
 */
export function updateFeeder(id: number, data: Partial<FeederInfo>) {
  return http.request({
    url: `/admin/feeders/${id}`,
    method: 'PUT',
    data,
  })
}

/**
 * 删除喂养员
 */
export function deleteFeeder(id: number) {
  return http.request({
    url: `/admin/feeders/${id}`,
    method: 'DELETE',
  })
}

/**
 * 审核喂养员
 */
export function auditFeeder(data: FeederAuditData) {
  return http.request({
    url: `/admin/feeder/${data.id}/audit`, 
    method: 'POST',
    data: {
      action: data.action,
      rejection_reason: data.rejection_reason,
    },
  })
}

/**
 * 启用/禁用喂养员
 */
export function updateFeederStatus(id: number, status: number) {
  return http.request({
    url: `/admin/feeder/${id}/status`, 
    method: 'PUT',
    data: { status },
  })
}

/**
 * 获取喂养员统计数据
 */
export function getFeederStats() {
  return http.request({
    url: '/admin/feeder/stats', 
    method: 'GET',
  })
}

/**
 * 获取喂养员审核列表
 */
export function getFeederAuditList(params: FeederListParams) {
  return http.request({
    url: '/admin/feeder/audit-list', 
    method: 'GET',
    params,
  })
}

/**
 * 获取喂养员服务记录
 */
export function getFeederServiceRecords(feederId: number, params?: { page?: number; pageSize?: number }) {
  return http.request({
    url: `/admin/feeder/${feederId}/service-records`, 
    method: 'GET',
    params,
  })
}

/**
 * 获取喂养员签到记录
 */
export function getFeederCheckins(feederId: number, params?: { page?: number; pageSize?: number }) {
  return http.request({
    url: `/admin/feeder/${feederId}/checkins`,
    method: 'GET',
    params,
  })
}

/**
 * 批量操作喂养员
 */
export function batchUpdateFeeders(ids: number[], action: string, data?: any) {
  return http.request({
    url: '/admin/feeder/batch', 
    method: 'POST',
    data: {
      ids,
      action,
      ...data,
    },
  })
}

/**
 * 导出喂养员数据
 */
export function exportFeeders(params: FeederListParams) {
  return http.request({
    url: '/admin/feeder/export', 
    method: 'GET',
    params,
    responseType: 'blob',
  })
}

/**
 * 获取喂养员地理分布数据
 */
export function getFeederLocationStats() {
  return http.request({
    url: '/admin/feeder/location-stats', 
    method: 'GET',
  })
}

/**
 * 获取喂养员评分统计
 */
export function getFeederRatingStats() {
  return http.request({
    url: '/admin/feeder/rating-stats', 
    method: 'GET',
  })
}