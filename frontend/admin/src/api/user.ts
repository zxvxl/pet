import { Alova } from '@/utils/http/alova';

export function getUserList(params) {
  // User list is retrieved from /users
  return Alova.Get('/users', { params });
}
