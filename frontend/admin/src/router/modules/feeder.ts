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
  },
  children: [
    {
      path: '/feeders/list',
      name: 'FeederList',
      component: () => import('@/views/feeder/FeederList.vue'),
      meta: {
        title: '喂养员列表',
        icon: 'list',
        hideMenu: false,
      },
    },
    {
      path: '/feeders/audit',
      name: 'FeederAudit',
      component: () => import('@/views/feeder/FeederAudit.vue'),
      meta: {
        title: '审核中心',
        icon: 'checkmark-circle',
        hideMenu: false,
      },
    },
  ],
};

export default feeder; 