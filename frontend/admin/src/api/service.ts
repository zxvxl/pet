import { Alova } from '@/utils/http/alova';

export function getServiceList(params) {
  // Service types list endpoint
  return Alova.Get('/service-types', { params });
}
export function createService(params) {
  // Create service type
  return Alova.Post('/service-types', { params });
}
