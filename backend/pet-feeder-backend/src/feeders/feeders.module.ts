import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedersService } from './feeders.service';
import { FeedersController } from './feeders.controller';
import { FeederSelfController } from './feeder-self.controller';
import { Feeder } from './entities/feeder.entity';
import { FeederSchedulesModule } from '../feeder-schedules/feeder-schedules.module';

@Module({
  imports: [TypeOrmModule.forFeature([Feeder]), FeederSchedulesModule],
  controllers: [FeedersController, FeederSelfController],
  providers: [FeedersService],
  exports: [FeedersService],
})
export class FeedersModule {}
