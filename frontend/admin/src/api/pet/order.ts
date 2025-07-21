import { Alova } from '@/utils/http/alova';

export function getOrderList(params) {
  return Alova.Get('/admin/order/list', { params });
}
