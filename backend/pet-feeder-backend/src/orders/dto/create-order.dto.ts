export class CreateOrderDto {
  userId: number;
  petId: number;
  feederId?: number;
  startTime: Date;
  endTime: Date;
  status: string;
}
