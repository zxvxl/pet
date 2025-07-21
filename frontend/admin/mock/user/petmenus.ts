import { defineMock } from '@alova/mock';
import { resultSuccess } from '../_util';

const menusList = [
  { name: '用户管理', path: '/user', component: '/user/index' },
  { name: '宠物管理', path: '/pet', component: '/pet/index' },
  { name: '订单管理', path: '/order', component: '/order/index' },
  { name: '服务项目管理', path: '/service', component: '/service/index' },
  { name: '喂养员审核', path: '/feeder', component: '/feeder/index' },
  { name: '财务结算', path: '/settlement', component: '/settlement/index' },
  { name: '投诉反馈', path: '/feedback', component: '/feedback/index' }
];

export default defineMock({
  '/api/admin/menu/list': () => resultSuccess(menusList)
});
