import type { AppRouteRecordRaw } from '../types';

const admin: AppRouteRecordRaw = {
  path: '/admin',
  name: 'Admin',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '系统管理',
    icon: 'setting',
    orderNo: 10,
  },
  children: [
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: () => import('@/views/admin/users/index.vue'),
      meta: {
        title: '管理员账户',
        icon: 'user',
        hideMenu: false,
      },
    },
  ],
};

export default admin;