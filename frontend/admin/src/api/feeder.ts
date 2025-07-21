import { Alova } from '@/utils/http/alova';

export function getFeederPending(params) {
  return Alova.Get('/admin/feeder/pending', { params });
}
export function approveFeeder(params) {
  return Alova.Post('/admin/feeder/approve', { params });
}
