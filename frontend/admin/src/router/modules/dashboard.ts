import type { AppRouteRecordRaw } from '../types';

const dashboard: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/layout/index.vue'),
  redirect: '/dashboard/index',
  meta: {
    title: '首页 Dashboard',
    icon: 'dashboard',
    orderNo: 1,
  },
  children: [
    {
      path: '/dashboard/index',
      name: 'DashboardIndex',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '首页概览',
        icon: 'dashboard',
        hideMenu: false,
      },
    },
  ],
};

export default dashboard;