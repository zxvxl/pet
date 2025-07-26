import type { AppRouteRecordRaw } from '../types';

const device: AppRouteRecordRaw = {
  path: '/device',
  name: 'Device',
  component: () => import('@/layout/index.vue'),
  redirect: '/device/feeder',
  meta: {
    title: '设备管理',
    icon: 'printer',
    orderNo: 4,
  },
  children: [
    {
      path: '/device/feeder',
      name: 'DeviceFeeder',
      component: () => import('@/views/device/feeder/index.vue'),
      meta: {
        title: '喂养人列表',
        icon: 'people',
        hideMenu: false,
      },
    },
  ],
};

export default device; 