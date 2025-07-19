import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Feeder } from '../feeders/entities/feeder.entity';
import { WxPayService } from './wx-pay.service';
import { ConfigService } from '../infrastructure/config.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Feeder])],
  controllers: [OrdersController],
  providers: [OrdersService, WxPayService, ConfigService],
})
export class OrdersModule {}
