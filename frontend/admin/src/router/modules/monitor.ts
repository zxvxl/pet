import type { AppRouteRecordRaw } from '../types';

const monitor: AppRouteRecordRaw = {
  path: '/monitor',
  name: 'Monitor',
  component: () => import('@/layout/index.vue'),
  redirect: '/monitor/index',
  meta: {
    title: '系统监控',
    icon: 'analytics',
    orderNo: 7,
  },
  children: [
    {
      path: '/monitor/index',
      name: 'MonitorIndex',
      component: () => import('@/views/monitor/index.vue'),
      meta: {
        title: '系统监控',
        icon: 'analytics',
        hideMenu: false,
      },
    },
  ],
};

export default monitor; 