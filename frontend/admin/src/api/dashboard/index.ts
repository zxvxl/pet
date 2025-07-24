import { Alova as http } from '@/utils/http/alova';

export interface DashboardSummary {
  todayUserCount: number;
  todayFeederCount: number;
  todayOrderCount: number;
  todayAmount: number;
  totalUserCount: number;
  totalFeederCount: number;
  totalOrderCount: number;
  totalAmount: number;
  orderStats: {
    pending: number;
    completed: number;
    refund: number;
    complaint: number;
  };
}

export interface ChartData {
  dates: string[];
  orderCounts: number[];
  orderAmounts?: number[];
}

/**
 * 获取仪表盘概况数据
 */
export function getDashboardSummary() {
  return http.Get<DashboardSummary>('/dashboard/summary');
}

/**
 * 获取趋势图数据
 * @param range 时间范围，可选值：7, 30
 */
export function getDashboardChart(range: number = 7) {
  return http.Get<ChartData>(`/dashboard/chart?range=${range}`);
}