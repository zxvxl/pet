import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceOrder } from './entities/service-order.entity';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { SignInDto } from './dto/sign-in.dto';
import { CompleteServiceDto } from './dto/complete-service.dto';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class ServiceOrdersService {
  constructor(
    @InjectRepository(ServiceOrder)
    private repository: Repository<ServiceOrder>,
  ) {}

  create(dto: CreateServiceOrderDto) {
    const entity = this.repository.create({
      feeder: { id: dto.feederId } as Feeder,
      order: { id: dto.orderId } as Order,
      status: 0,
    });
    return this.repository.save(entity);
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id }, relations: ['feeder', 'order'] });
  }

  signIn(id: number, dto: SignInDto) {
    return this.repository.update(id, {
      signInLat: dto.lat,
      signInLng: dto.lng,
      signInTime: new Date(),
      status: 1,
    });
  }

  complete(id: number, dto: CompleteServiceDto) {
    return this.repository.update(id, {
      completeTime: new Date(),
      description: dto.description,
      completeImages: dto.images,
      status: 2,
    });
  }

  cancel(id: number) {
    return this.repository.update(id, { status: 3 });
  }
}
