// 喂养员管理路由配置

import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils/renderIcon'
import { Team } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/feeders',
  name: 'Feeders',
  redirect: '/feeders/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '喂养员管理',
    icon: renderIcon(Team),
    orderNo: 2,
    roles: ['super'], // 仅超级管理员可见
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'FeederList',
      component: () => import('@/views/feeders/FeederList.vue'),
      meta: {
        title: '喂养员列表',
        icon: renderIcon(Team),
        roles: ['super', 'feeder_manager'],
        hideMenu: false,
      },
    },
    {
      path: 'audit',
      name: 'FeederAudit',
      component: () => import('@/views/feeders/FeederAudit.vue'),
      meta: {
        title: '审核中心',
        icon: 'check-circle',
        roles: ['super', 'feeder_manager'],
        hideMenu: false,
      },
    },
  ],
}

export default routes