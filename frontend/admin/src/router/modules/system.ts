import type { AppRouteRecordRaw } from '../types';

const system: AppRouteRecordRaw = {
  path: '/system',
  name: 'System',
  component: () => import('@/layout/index.vue'),
  redirect: '/system/role',
  meta: {
    title: '系统管理',
    icon: 'setting',
    orderNo: 1,
  },
  children: [
    {
      path: '/system/role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: '角色管理',
        icon: 'shield',
        hideMenu: false,
      },
    },
    {
      path: '/system/permission',
      name: 'SystemPermission',
      component: () => import('@/views/system/permission/index.vue'),
      meta: {
        title: '权限管理',
        icon: 'key',
        hideMenu: false,
      },
    },
    {
      path: '/system/menu',
      name: 'SystemMenu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        title: '菜单管理',
        icon: 'menu',
        hideMenu: false,
      },
    },
    {
      path: '/system/log',
      name: 'SystemLog',
      component: () => import('@/views/system/log/index.vue'),
      meta: {
        title: '操作日志',
        icon: 'document-text',
        hideMenu: false,
      },
    },
  ],
};

export default system; 