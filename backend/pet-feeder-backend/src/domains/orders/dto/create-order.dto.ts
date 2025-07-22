// 👉 模块：创建订单 DTO
export class CreateOrderDto {
  /** 用户ID，必填 */
  userId: number;
  /** 宠物ID，必填 */
  petId: number;
  /** 指定喂养员ID，可选 */
  feederId?: number;
  /** 开始时间，ISO 日期字符串 */
  startTime: Date;
  /** 结束时间，ISO 日期字符串 */
  endTime: Date;
  /** 订单状态，可选，默认 pending */
  status?: string;
}
