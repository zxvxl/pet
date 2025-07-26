import type { AppRouteRecordRaw } from '../types';

const complaint: AppRouteRecordRaw = {
  path: '/complaint',
  name: 'Complaint',
  component: () => import('@/layout/index.vue'),
  redirect: '/complaint/list',
  meta: {
    title: '投诉管理',
    icon: 'warning',
    orderNo: 5,
  },
  children: [
    {
      path: '/complaint/list',
      name: 'ComplaintList',
      component: () => import('@/views/complaint/list/index.vue'),
      meta: {
        title: '投诉列表',
        icon: 'list',
        hideMenu: false,
      },
    },
    {
      path: '/complaint/statistics',
      name: 'ComplaintStatistics',
      component: () => import('@/views/complaint/statistics/index.vue'),
      meta: {
        title: '投诉统计',
        icon: 'bar-chart',
        hideMenu: false,
      },
    },
  ],
};

export default complaint; 