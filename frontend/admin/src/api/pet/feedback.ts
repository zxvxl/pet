import { Alova } from '@/utils/http/alova';

export function getFeedbackList(params) {
  return Alova.Get('/admin/feedback/list', { params });
}
