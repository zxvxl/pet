import type { RouteRecordRaw } from 'vue-router'
import { renderIcon } from '@/utils'
import { People, PersonAdd } from '@vicons/ionicons5'

const routes: RouteRecordRaw = {
  path: '/feeders',
  name: 'Feeders',
  redirect: '/feeder/list',
  component: () => import('@/layout/index.vue'),
  meta: {
    title: '喂养员管理',
    icon: renderIcon(People),
    orderNo: 2,
    roles: ['super'],
    hideMenu: false,
  },
  children: [
    {
      path: 'list',
      name: 'FeederList',
      component: () => import('@/views/feeder/FeederList.vue'),
      meta: {
        title: '喂养员列表',
        icon: renderIcon(People),
        roles: ['super', 'feeder_manager'],
        hideMenu: false,
      },
    },
    {
      path: 'audit',
      name: 'FeederAudit',
      component: () => import('@/views/feeder/FeederAudit.vue'),
      meta: {
        title: '审核中心',
        icon: renderIcon(PersonAdd),
        roles: ['super', 'feeder_manager'],
        hideMenu: false,
      },
    },
  ],
}

export default routes
