import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeederOrdersService } from './feeder-orders.service';
import { FeederOrdersController } from './feeder-orders.controller';
import { FeederOrder } from './entities/feeder-order.entity';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';
import { TrackingModule } from '../tracking/tracking.module';
import { FeedersModule } from '../feeders/feeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeederOrder, Feeder, Order]),
    TrackingModule,
    FeedersModule,
  ],
  controllers: [FeederOrdersController],
  providers: [FeederOrdersService],
})
export class FeederOrdersModule {}
