import { Alova } from '@/utils/http/alova';

export function getOrderList(params) {
  // Orders are retrieved via /orders/all
  return Alova.Get('/orders/all', { params });
}
