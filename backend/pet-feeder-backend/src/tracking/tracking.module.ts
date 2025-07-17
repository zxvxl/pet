import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { ServiceOrder } from '../service-orders/entities/service-order.entity';
import { FeederLocation } from './entities/feeder-location.entity';
import { TrackingGateway } from './tracking.gateway';
import { WxTemplateService } from './wx-template.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceOrder, FeederLocation])],
  providers: [TrackingService, TrackingGateway, WxTemplateService],
  controllers: [TrackingController],
  exports: [TrackingGateway, TrackingService, WxTemplateService],
})
export class TrackingModule {}
