import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOrder } from '../service-orders/entities/service-order.entity';
import { FeederLocation } from './entities/feeder-location.entity';
import { UpdateLocationDto } from './dto/update-location.dto';
import { TrackingGateway } from './tracking.gateway';

@Injectable()
export class TrackingService {
  constructor(
    @InjectRepository(ServiceOrder)
    private orders: Repository<ServiceOrder>,
    @InjectRepository(FeederLocation)
    private locations: Repository<FeederLocation>,
    private gateway: TrackingGateway,
  ) {}

  async getStatus(id: number) {
    return this.orders.findOne({ where: { id } });
  }

  async reportLocation(id: number, dto: UpdateLocationDto) {
    const record = this.locations.create({
      order: { id } as ServiceOrder,
      lat: dto.lat,
      lng: dto.lng,
    });
    const saved = await this.locations.save(record);
    this.gateway.notifyLocation(id, saved);
    return saved;
  }
}
