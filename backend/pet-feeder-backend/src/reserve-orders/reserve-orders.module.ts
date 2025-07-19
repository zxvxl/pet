import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReserveOrdersService } from './reserve-orders.service';
import { ReserveOrdersController } from './reserve-orders.controller';
import { OrderEntity } from './entities/order.entity';
import { OrderServiceItem } from './entities/order-service-item.entity';
import { ServiceType } from '../service-types/entities/service-type.entity';
import { Pet } from '../pets/entities/pet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, OrderServiceItem, ServiceType, Pet]),
  ],
  controllers: [ReserveOrdersController],
  providers: [ReserveOrdersService],
})
export class ReserveOrdersModule {}
