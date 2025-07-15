import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedersService } from './feeders.service';
import { FeedersController } from './feeders.controller';
import { Feeder } from './entities/feeder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feeder])],
  controllers: [FeedersController],
  providers: [FeedersService],
})
export class FeedersModule {}
