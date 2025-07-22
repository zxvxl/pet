import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

// 👉 模块：更新订单 DTO
/** 继承创建 DTO 的部分字段，全部为可选 */
export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
