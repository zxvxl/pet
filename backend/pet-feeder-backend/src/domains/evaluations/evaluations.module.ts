import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation } from './entities/evaluation.entity';
import { Order } from '../orders/entities/order.entity';
import { Feeder } from '../feeders/entities/feeder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evaluation, Order, Feeder])],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
})
export class EvaluationsModule {}
