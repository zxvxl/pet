import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Document } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/orders',
  name: 'Orders',
  redirect: '/order/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '订单管理',
    icon: renderIcon(Document),
    orderNo: 3,
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/order/OrderList.vue'),
      meta: {
        title: '订单列表',
        icon: renderIcon(Document),
        hideMenu: false,
      },
    },
  ],
}

export default routes
