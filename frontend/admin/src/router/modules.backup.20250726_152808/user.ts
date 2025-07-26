// frontend/admin/src/router/modules/user.ts
// 用户管理路由配置

import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils/renderIcon'
import { People } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/users',
  name: 'Users',
  redirect: '/users/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '用户管理',
    icon: renderIcon(People),
    orderNo: 4,
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/users/UserList.vue'),
      meta: {
        title: '用户列表',
        icon: renderIcon(People),
        hideMenu: false,
      },
    },
    {
      path: 'admin',
      name: 'AdminUsers',
      component: () => import('@/views/admin/users/index.vue'),
      meta: {
        title: '管理员用户',
        icon: 'user-settings',
        roles: ['super'],
        hideMenu: false,
      },
    },
  ],
}

export default routes