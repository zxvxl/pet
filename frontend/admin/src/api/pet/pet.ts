import { Alova } from '@/utils/http/alova';

export function getPetList(params) {
  return Alova.Get('/admin/pet/list', { params });
}
