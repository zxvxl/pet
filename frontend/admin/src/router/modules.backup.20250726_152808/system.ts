// frontend/admin/src/router/modules/system.ts
// 系统管理路由配置（保持不变）

import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils/renderIcon'
import { Settings } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/system',
  name: 'System',
  redirect: '/system/role',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '系统管理',
    icon: renderIcon(Settings),
    orderNo: 10,
    roles: ['super'], // 仅超级管理员可见
    hideMenu: false,
  },
  children: [
    {
      path: 'role',
      name: 'SystemRole',
      component: () => import('@/views/system/role/index.vue'),
      meta: {
        title: '角色管理',
        icon: 'team',
        roles: ['super'],
        hideMenu: false,
      },
    },
    {
      path: 'permission',
      name: 'SystemPermission',
      component: () => import('@/views/system/permission/index.vue'),
      meta: {
        title: '权限管理',
        icon: 'lock',
        roles: ['super'],
        hideMenu: false,
      },
    },
    {
      path: 'menu',
      name: 'SystemMenu',
      component: () => import('@/views/system/menu/index.vue'),
      meta: {
        title: '菜单管理',
        icon: 'menu',
        roles: ['super'],
        hideMenu: false,
      },
    },
    {
      path: 'log',
      name: 'SystemLog',
      component: () => import('@/views/system/log/index.vue'),
      meta: {
        title: '操作日志',
        icon: 'file-search',
        roles: ['super'],
        hideMenu: false,
      },
    },
  ],
}

export default routes