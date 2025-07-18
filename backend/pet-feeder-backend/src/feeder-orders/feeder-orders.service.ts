import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeederOrder, FeederOrderStatus } from './entities/feeder-order.entity';
import { CreateFeederOrderDto } from './dto/create-feeder-order.dto';
import { CompleteFeederOrderDto } from './dto/complete-feeder-order.dto';
import { User } from '../users/entities/user.entity';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Pet } from '../pets/entities/pet.entity';

@Injectable()
export class FeederOrdersService {
  constructor(
    @InjectRepository(FeederOrder)
    private orders: Repository<FeederOrder>,
  ) {}

  create(dto: CreateFeederOrderDto) {
    const entity = this.orders.create({
      user: { id: dto.userId } as User,
      feeder: { id: dto.feederId } as Feeder,
      pet: { id: dto.petId } as Pet,
      serviceTime: dto.serviceTime,
      address: dto.address,
      status: FeederOrderStatus.PENDING,
    });
    return this.orders.save(entity);
  }

  async paginateByFeeder(feederId: number, page: number, limit: number) {
    const [items, total] = await this.orders.findAndCount({
      where: { feeder: { id: feederId } },
      relations: ['user', 'pet', 'feeder'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  private async get(id: number) {
    const order = await this.orders.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async confirm(id: number) {
    const order = await this.get(id);
    order.status = FeederOrderStatus.ACCEPTED;
    return this.orders.save(order);
  }

  async reject(id: number) {
    const order = await this.get(id);
    order.status = FeederOrderStatus.REJECTED;
    return this.orders.save(order);
  }

  async start(id: number) {
    const order = await this.get(id);
    order.status = FeederOrderStatus.SERVING;
    return this.orders.save(order);
  }

  async complete(id: number, dto: CompleteFeederOrderDto) {
    const order = await this.get(id);
    order.status = FeederOrderStatus.COMPLETED;
    order.images = dto.images;
    order.remark = dto.remark;
    return this.orders.save(order);
  }
}
