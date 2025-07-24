import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReserveOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderServiceItem } from './entities/order-service-item.entity';
import { ServiceType } from '../service-types/entities/service-type.entity';
import { Pet } from '../pets/entities/pet.entity';

@Injectable()
export class ReserveOrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private ordersRepo: Repository<OrderEntity>,
    @InjectRepository(OrderServiceItem)
    private itemsRepo: Repository<OrderServiceItem>,
    @InjectRepository(ServiceType)
    private serviceRepo: Repository<ServiceType>,
    @InjectRepository(Pet)
    private petRepo: Repository<Pet>,
  ) {}

  async create(dto: CreateReserveOrderDto, userId: number) {
    return this.ordersRepo.manager.transaction(async (manager) => {
      const orderRepo = manager.getRepository(OrderEntity);
      const itemRepo = manager.getRepository(OrderServiceItem);
      const serviceRepo = manager.getRepository(ServiceType);
      const petRepo = manager.getRepository(Pet);

      if (new Date(dto.reserveTime) <= new Date()) {
        throw new BadRequestException('reserveTime must be future');
      }

      const items: OrderServiceItem[] = [];
      let total = 0;
      for (const it of dto.items) {
        const service = await serviceRepo.findOne({ where: { id: it.serviceId } });
        if (!service) throw new BadRequestException('invalid service');
        const pet = await petRepo.findOne({
          where: { id: it.petId, user: { id: userId } },
          relations: ['user'],
        });
        if (!pet) throw new BadRequestException('invalid pet');
        total += Number(service.price);
        const item = itemRepo.create({
          service,
          pet,
          price: Number(service.price),
          service_name: service.name,
        });
        items.push(item);
      }

      const order = orderRepo.create({
        user: { id: userId } as any,
        reserve_time: dto.reserveTime,
        address: dto.address,
        remark: dto.remark,
        total_amount: total,
        status: 'pending',
        items,
      });
      return orderRepo.save(order);
    });
  }

  findByUser(userId: number) {
    return this.ordersRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.pet', 'items.service'],
      order: { id: 'DESC' },
    });
  }

  findOne(id: number, userId: number) {
    return this.ordersRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['items', 'items.pet', 'items.service'],
    });
  }
}
