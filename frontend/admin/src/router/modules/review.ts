import type { AppRouteRecordRaw } from '../types';

const review: AppRouteRecordRaw = {
  path: '/reviews',
  name: 'Review',
  component: () => import('@/layout/index.vue'),
  redirect: '/reviews/list',
  meta: {
    title: '服务评价',
    icon: 'star',
    orderNo: 5,
  },
  children: [
    {
      path: '/reviews/list',
      name: 'ReviewList',
      component: () => import('@/views/reviews/ReviewList.vue'),
      meta: {
        title: '评价列表',
        icon: 'list',
        hideMenu: false,
      },
    },
    {
      path: '/reviews/feedback',
      name: 'FeedbackList',
      component: () => import('@/views/reviews/FeedbackList.vue'),
      meta: {
        title: '反馈投诉',
        icon: 'warning',
        hideMenu: false,
      },
    },
  ],
};

export default review; 