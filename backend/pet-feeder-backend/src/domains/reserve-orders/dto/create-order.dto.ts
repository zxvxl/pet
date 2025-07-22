export interface CreateOrderItemDto {
  serviceId: number;
  petId: number;
}

export class CreateReserveOrderDto {
  userId?: number;
  reserveTime: Date;
  address: string;
  remark?: string;
  items: CreateOrderItemDto[];
}
