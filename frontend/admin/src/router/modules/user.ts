import type { AppRouteRecordRaw } from '../types';

const user: AppRouteRecordRaw = {
  path: '/user',
  name: 'User',
  component: () => import('@/layout/index.vue'),
  redirect: '/user/admin',
  meta: {
    title: '用户管理',
    icon: 'people',
    orderNo: 2,
  },
  children: [
    {
      path: '/user/admin',
      name: 'UserAdmin',
      component: () => import('@/views/user/admin/index.vue'),
      meta: {
        title: '管理员用户',
        icon: 'shield-checkmark',
        hideMenu: false,
      },
    },
    {
      path: '/user/normal',
      name: 'UserNormal',
      component: () => import('@/views/user/normal/index.vue'),
      meta: {
        title: '普通用户',
        icon: 'person',
        hideMenu: false,
      },
    },
  ],
};

export default user; 