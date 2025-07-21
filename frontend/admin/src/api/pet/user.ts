import { Alova } from '@/utils/http/alova';

export function getUserList(params) {
  return Alova.Get('/admin/user/list', { params });
}
