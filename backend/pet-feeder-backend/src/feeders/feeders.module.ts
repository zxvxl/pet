import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedersService } from './feeders.service';
import { FeedersController } from './feeders.controller';
import { FeederSelfController } from './feeder-self.controller';
import { Feeder } from './entities/feeder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feeder])],
  controllers: [FeedersController, FeederSelfController],
  providers: [FeedersService],
  exports: [FeedersService],
})
export class FeedersModule {}
