// frontend/admin/src/router/modules/order.ts
// 订单管理路由配置

import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils/renderIcon'
import { Receipt } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/orders',
  name: 'Orders',
  redirect: '/orders/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '订单管理',
    icon: renderIcon(Receipt),
    orderNo: 3,
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/orders/OrderList.vue'),
      meta: {
        title: '订单列表',
        icon: renderIcon(Receipt),
        hideMenu: false,
      },
    },
  ],
}

export default routes
