import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { Feeder } from '../feeders/entities/feeder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Feeder])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
