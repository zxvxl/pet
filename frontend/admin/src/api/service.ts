import { Alova } from '@/utils/http/alova';

export function getServiceList(params) {
  return Alova.Get('/admin/service/list', { params });
}
export function createService(params) {
  return Alova.Post('/admin/service/create', { params });
}
