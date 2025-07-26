import type { AppRouteRecordRaw } from '../types';

const feeder: AppRouteRecordRaw = {
  path: '/feeders',
  name: 'Feeder',
  component: () => import('@/layout/index.vue'),
  redirect: '/feeders/list',
  meta: {
    title: '喂养员管理',
    icon: 'people',
    orderNo: 2,
    roles: ['super'] // 只有超级管理员可见
  },
  children: [
    {
      path: '/feeders/list',
      name: 'FeederList',
      component: () => import('@/views/feeders/FeederList.vue'),
      meta: {
        title: '喂养员列表',
        icon: 'list',
        hideMenu: false,
        roles: ['super']
      },
    },
    {
      path: '/feeders/audit',
      name: 'FeederAudit',
      component: () => import('@/views/feeders/FeederAudit.vue'),
      meta: {
        title: '审核中心',
        icon: 'checkmark-circle',
        hideMenu: false,
        roles: ['super']
      },
    },
  ],
};

export default feeder; 