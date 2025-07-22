import { Alova } from '@/utils/http/alova';

export function getFeederPending(params) {
  // Backend lists pending feeders via /admin/feeders with status query
  return Alova.Get('/admin/feeders', { params });
}
export function approveFeeder(params) {
  // Approve feeder uses /admin/feeders/audit endpoint
  return Alova.Post('/admin/feeders/audit', { params });
}
