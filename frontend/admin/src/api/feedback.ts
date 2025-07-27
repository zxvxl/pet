// frontend/admin/src/api/reviews.ts
// 评价反馈相关API接口

import { Alova as http } from '@/utils/http/alova'

// 评价信息类型
export interface EvaluationInfo {
  id: number
  order_id: number
  order?: {
    id: number
    order_no: string
    service_name: string
  }
  user_id: number
  user?: {
    id: number
    nickname: string
    avatar?: string
  }
  feeder_id: number
  feeder?: {
    id: number
    name: string
  }
  role: 'user' | 'feeder'
  star: number
  tags?: string[]
  content?: string
  images?: string[]
  anonymous: boolean
  created_at: string
  updated_at: string
}

// 投诉信息类型
export interface ComplaintInfo {
  id: number
  order_id: number
  order?: {
    id: number
    order_no: string
  }
  user_id: number
  user?: {
    id: number
    nickname: string
  }
  complaint_type: string
  content: string
  images?: string[]
  status: string
  result?: string
  handled_by?: number
  handled_at?: string
  created_at: string
  updated_at: string
}

// 反馈信息类型
export interface FeedbackInfo {
  id: number
  user_id: number
  user?: {
    id: number
    nickname: string
  }
  type: string
  title: string
  content: string
  images?: string[]
  contact?: string
  status: string
  reply?: string
  replied_by?: number
  replied_at?: string
  created_at: string
  updated_at: string
}

// 查询参数
export interface ReviewListParams {
  page?: number
  pageSize?: number
  keyword?: string
  star?: number
  dateRange?: [string, string]
}

export interface ComplaintListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  type?: string
  dateRange?: [string, string]
}

export interface FeedbackListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  type?: string
  dateRange?: [string, string]
}

/**
 * 获取评价列表
 */
export function getEvaluationList(params: ReviewListParams) {
  return http.Get('/admin/evaluations', { params })
}

/**
 * 获取评价详情
 */
export function getEvaluationDetail(id: number) {
  return http.Get(`/admin/evaluations/${id}`)
}

/**
 * 删除评价
 */
export function deleteEvaluation(id: number) {
  return http.Delete(`/admin/evaluations/${id}`)
}

/**
 * 获取投诉列表
 */
export function getComplaintList(params: ComplaintListParams) {
  return http.Get('/admin/complaints', { params })
}

/**
 * 获取投诉详情
 */
export function getComplaintDetail(id: number) {
  return http.Get(`/admin/complaints/${id}`)
}

/**
 * 处理投诉
 */
export function handleComplaint(id: number, data: { status: string; result: string }) {
  return http.Post(`/admin/complaints/${id}/handle`, data)
}

/**
 * 获取反馈列表
 */
export function getFeedbackList(params: FeedbackListParams) {
  return http.Get('/admin/feedback', { params })
}

/**
 * 获取反馈详情
 */
export function getFeedbackDetail(id: number) {
  return http.Get(`/admin/feedback/${id}`)
}

/**
 * 回复反馈
 */
export function replyFeedback(id: number, reply: string) {
  return http.Post(`/admin/feedback/${id}/reply`, { reply })
}

/**
 * 获取评价统计
 */
export function getEvaluationStats() {
  return http.Get('/admin/evaluations/stats')
}

/**
 * 获取投诉统计
 */
export function getComplaintStats() {
  return http.Get('/admin/complaints/stats')
}