// 👉 模块：订单管理 orders
// 此模块负责处理平台中的喂养订单创建、支付及查询等后端逻辑
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Feeder } from '../feeders/entities/feeder.entity';
import { WxPayService } from './wx-pay.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Feeder])],
  controllers: [OrdersController],
  providers: [OrdersService, WxPayService],
})
/**
 * 订单模块
 * 提供订单相关的服务与控制器注册
 */
export class OrdersModule {}
