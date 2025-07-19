import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeederSchedulesService } from './feeder-schedules.service';
import { FeederSchedulesController } from './feeder-schedules.controller';
import { FeederSchedule } from './entities/feeder-schedule.entity';
import { Feeder } from '../feeders/entities/feeder.entity';
import { FeederOrder } from '../feeder-orders/entities/feeder-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FeederSchedule, Feeder, FeederOrder])],
  controllers: [FeederSchedulesController],
  providers: [FeederSchedulesService],
  exports: [FeederSchedulesService],
})
export class FeederSchedulesModule {}
