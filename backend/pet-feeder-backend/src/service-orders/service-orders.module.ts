import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrdersService } from './service-orders.service';
import { ServiceOrdersController } from './service-orders.controller';
import { ServiceOrder } from './entities/service-order.entity';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceOrder, Feeder, Order]),
    TrackingModule,
  ],
  controllers: [ServiceOrdersController],
  providers: [ServiceOrdersService],
})
export class ServiceOrdersModule {}
