import { IsString } from 'class-validator';

export class PayOrderDto {
  @IsString()
  orderId: string;

  @IsString()
  openid: string;
}
