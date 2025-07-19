export class CreateFeederOrderDto {
  userId: number;
  feederId: number;
  petId: number;
  orderId: number;
  serviceTime: Date;
  address: string;
}
