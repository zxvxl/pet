import { Alova as http } from '@/utils/http/alova';

export interface AdminUser {
  id: number;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  roles: Array<{
    id: number;
    name: string;
    code: string;
  }>;
}

export interface AdminRole {
  id: number;
  name: string;
  code: string;
  description?: string;
}

export interface CreateAdminUserRequest {
  username: string;
  nickname: string;
  email: string;
  phone: string;
  roles: number[];
  password: string;
}

export interface UpdateAdminUserRequest {
  username?: string;
  nickname: string;
  email: string;
  phone: string;
  roles: number[];
  password?: string;
}

export interface AdminUserListResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 获取管理员用户列表
 */
export function getAdminUsers(params: {
  page?: number;
  limit?: number;
  keyword?: string;
} = {}) {
  return http.Get<AdminUserListResponse>('/admin-users', { params });
}

/**
 * 获取单个管理员用户详情
 */
export function getAdminUser(id: number) {
  return http.Get<AdminUser>(`/admin-users/${id}`);
}

/**
 * 创建管理员用户
 */
export function createAdminUser(data: CreateAdminUserRequest) {
  return http.Post<AdminUser>('/admin-users', data);
}

/**
 * 更新管理员用户
 */
export function updateAdminUser(id: number, data: UpdateAdminUserRequest) {
  return http.Patch<AdminUser>(`/admin-users/${id}`, data);
}

/**
 * 删除管理员用户
 */
export function deleteAdminUser(id: number) {
  return http.Delete(`/admin-users/${id}`);
}

/**
 * 获取管理员角色列表
 */
export function getAdminRoles() {
  return http.Get<{
    data: AdminRole[];
    total: number;
  }>('/admin-roles');
}