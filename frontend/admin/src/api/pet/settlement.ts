import { Alova } from '@/utils/http/alova';

export function getSettlementList(params) {
  return Alova.Get('/admin/settlement/list', { params });
}
