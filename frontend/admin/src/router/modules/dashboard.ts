import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Home } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/layout/index.vue'),
  redirect: '/dashboard/index',
  meta: {
    title: '首页',
    icon: renderIcon(Home),
    orderNo: 1,
    hideMenu: false,
  },
  children: [
    {
      path: 'index',
      name: 'DashboardIndex',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        title: '数据概览',
        hideMenu: false,
        affix: true,
      },
    },
  ],
}

export default routes
