import type { AppRouteRecordRaw } from '../types';

const order: AppRouteRecordRaw = {
  path: '/order',
  name: 'Order',
  component: () => import('@/layout/index.vue'),
  redirect: '/order/list',
  meta: {
    title: '订单管理',
    icon: 'file-text',
    orderNo: 3,
  },
  children: [
    {
      path: '/order/list',
      name: 'OrderList',
      component: () => import('@/views/order/OrderList.vue'),
      meta: {
        title: '订单列表',
        icon: 'list',
        hideMenu: false,
      },
    },
    {
      path: '/order/statistics',
      name: 'OrderStatistics',
      component: () => import('@/views/order/statistics/index.vue'),
      meta: {
        title: '订单统计',
        icon: 'bar-chart',
        hideMenu: false,
      },
    },
  ],
};

export default order; 