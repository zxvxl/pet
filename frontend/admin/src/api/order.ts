import { Alova as http } from '@/utils/http/alova';

export interface Order {
  id: number;
  order_no: string;
  user_name: string;
  feeder_name: string;
  service_name: string;
  pet_name: string;
  status: number;
  amount: number;
  payment_method: string;
  service_date: string;
  service_time: string;
  service_address: string;
  remark?: string;
  created_at: string;
  pay_time?: string;
  timeline?: Array<{
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    description: string;
    time: string;
  }>;
}

export interface OrderStats {
  todayOrders: number;
  pendingOrders: number;
  todayAmount: number;
  completionRate: number;
}

// 获取订单列表
export function getOrderList(params: any) {
  return http.Get('/admin/orders', { params });
}

// 获取订单统计
export function getOrderStats() {
  return http.Get('/admin/orders/stats');
}

// 获取订单详情
export function getOrderDetail(id: number) {
  return http.Get(`/admin/orders/${id}`);
}
