import { Alova } from '@/utils/http/alova';

export function getPetList(params) {
  // Pets are listed via /pets
  return Alova.Get('/pets', { params });
}
