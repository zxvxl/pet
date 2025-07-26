import type { AppRouteRecordRaw } from '../types';

const order: AppRouteRecordRaw = {
  path: '/orders',
  name: 'Order',
  component: () => import('@/layout/index.vue'),
  redirect: '/orders/list',
  meta: {
    title: '订单管理',
    icon: 'file-text',
    orderNo: 3,
  },
  children: [
    {
      path: '/orders/list',
      name: 'OrderList',
      component: () => import('@/views/orders/OrderList.vue'),
      meta: {
        title: '订单列表',
        icon: 'list',
        hideMenu: false,
      },
    },
  ],
};

export default order; 