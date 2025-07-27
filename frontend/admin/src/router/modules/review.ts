import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Star, Warning } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/reviews',
  name: 'Reviews',
  redirect: '/feedback/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '服务评价',
    icon: renderIcon(Star),
    orderNo: 5,
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'ReviewList',
      component: () => import('@/views/feedback/ReviewList.vue'),
      meta: {
        title: '评价列表',
        icon: renderIcon(Star),
        hideMenu: false,
      },
    },
    {
      path: 'feedback',
      name: 'FeedbackList',
      component: () => import('@/views/feedback/FeedbackList.vue'),
      meta: {
        title: '反馈投诉',
        icon: renderIcon(Warning),
        hideMenu: false,
      },
    },
  ],
}

export default routes
