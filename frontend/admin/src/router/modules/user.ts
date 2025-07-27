import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { Person, Settings } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/users',
  name: 'Users',
  redirect: '/user/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '用户管理',
    icon: renderIcon(Person),
    orderNo: 4,
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'UserList',
      component: () => import('@/views/user/UsersList.vue'),
      meta: {
        title: '用户列表',
        icon: renderIcon(Person),
        hideMenu: false,
      },
    },
    {
      path: 'admin',
      name: 'AdminUsers',
      component: () => import('@/views/admin/users/index.vue'),
      meta: {
        title: '管理员用户',
        icon: renderIcon(Settings),
        roles: ['super'],
        hideMenu: false,
      },
    },
  ],
}

export default routes
