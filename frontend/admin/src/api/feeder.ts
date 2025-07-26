import { Alova as http } from '@/utils/http/alova';

export interface FeederUser {
  id: number;
  name: string;
  phone: string;
  id_card: string;
  status: number;
  address: string;
  bio?: string;
  created_at: string;
  last_login_at?: string;
  rating?: number;
  order_count?: number;
}

export interface FeederApplication {
  id: number;
  name: string;
  phone: string;
  id_card: string;
  status: number;
  address: string;
  bio?: string;
  created_at: string;
  id_card_front?: string;
  id_card_back?: string;
  avatar?: string;
  audit_time?: string;
  audit_user?: string;
  reject_reason?: string;
}

export interface AuditStats {
  pending: number;
  todayAudited: number;
  passRate: number;
  avgAuditTime: number;
}

// 获取喂养员列表
export function getFeederList(params: any) {
  return http.Get('/admin/feeders', { params });
}

// 更新喂养员状态
export function updateFeederStatus(id: number, status: number) {
  return http.Put(`/admin/feeders/${id}/status`, { status });
}

// 获取审核列表
export function getFeederAuditList(params: any) {
  return http.Get('/admin/feeders/audit', { params });
}

// 通过审核
export function approveFeeder(id: number) {
  return http.Put(`/admin/feeders/${id}/approve`);
}

// 拒绝申请
export function rejectFeeder(id: number, data: { reason: string; detail: string }) {
  return http.Put(`/admin/feeders/${id}/reject`, data);
}

// 获取审核统计
export function getAuditStats() {
  return http.Get('/admin/feeders/audit/stats');
}
