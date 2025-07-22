import { Alova } from '@/utils/http/alova';

export function getFeedbackList(params) {
  // Feedback list endpoint
  return Alova.Get('/admin/feedback', { params });
}
