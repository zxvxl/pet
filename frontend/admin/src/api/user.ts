// frontend/admin/src/api/users.ts
// 用户管理相关API接口

import { Alova as http } from '@/utils/http/alova'

// 用户信息类型
export interface UserInfo {
  id: number
  openid?: string
  username?: string
  nickname?: string
  avatar?: string
  phone?: string
  email?: string
  created_at: string
  updated_at: string
}

// 用户列表查询参数
export interface UserListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: number
}

// 用户统计数据
export interface UserStats {
  totalUsers: number
  activeUsers: number
  todayNewUsers: number
  monthlyGrowth: number
}

/**
 * 获取用户列表
 */
export function getUserList(params: UserListParams) {
  return http.Get('/admin/user', { params })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: number) {
  return http.Get(`/admin/user/${id}`)
}

/**
 * 创建用户
 */
export function createUser(data: Partial<UserInfo>) {
  return http.Post('/admin/user', data)
}

/**
 * 更新用户信息
 */
export function updateUser(id: number, data: Partial<UserInfo>) {
  return http.Put(`/admin/user/${id}`, data)
}

/**
 * 删除用户
 */
export function deleteUser(id: number) {
  return http.Delete(`/admin/user/${id}`)
}

/**
 * 获取用户统计
 */
export function getUserStats() {
  return http.Get('/admin/user/stats')
}

/**
 * 启用/禁用用户
 */
export function toggleUserStatus(id: number, status: boolean) {
  return http.Put(`/admin/user/${id}/status`, { is_active: status })
}

/**
 * 批量删除用户
 */
export function batchDeleteUsers(ids: number[]) {
  return http.Post('/admin/user/batch-delete', { ids })
}