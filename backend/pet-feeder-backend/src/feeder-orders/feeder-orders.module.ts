import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeederOrdersService } from './feeder-orders.service';
import { FeederOrdersController } from './feeder-orders.controller';
import { FeederOrder } from './entities/feeder-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeederOrder])],
  controllers: [FeederOrdersController],
  providers: [FeederOrdersService],
})
export class FeederOrdersModule {}
