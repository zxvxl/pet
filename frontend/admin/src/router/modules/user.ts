import type { AppRouteRecordRaw } from '../types';

const user: AppRouteRecordRaw = {
  path: '/users',
  name: 'User',
  component: () => import('@/layout/index.vue'),
  redirect: '/users/list',
  meta: {
    title: '用户管理',
    icon: 'people',
    orderNo: 4,
  },
  children: [
    {
      path: '/users/list',
      name: 'UserList',
      component: () => import("@/views/user/UserList.vue"),
      meta: {
        title: '用户列表',
        icon: 'list',
        hideMenu: false,
      },
    },
  ],
};

export default user;