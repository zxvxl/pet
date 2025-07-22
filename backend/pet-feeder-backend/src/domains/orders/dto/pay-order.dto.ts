import { IsString } from 'class-validator';

// 👉 模块：支付订单 DTO
export class PayOrderDto {
  /** 订单ID，字符串形式 */
  @IsString()
  orderId: string;

  /** 用户的 openid，用于微信支付 */
  @IsString()
  openid: string;
}
