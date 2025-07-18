import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Feeder } from '../feeders/entities/feeder.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Feeder)
    private feedersRepository: Repository<Feeder>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    return this.ordersRepository.manager.transaction(async (manager) => {
      const feedersRepo = manager.getRepository(Feeder);
      let feederId = createOrderDto.feederId;
      if (!feederId) {
        const available = await feedersRepo.find({
          where: { status: 1, isBlacklist: 0 },
        });
        if (available.length === 0) {
          throw new BadRequestException('NO_FEEDER');
        }
        feederId =
          available[Math.floor(Math.random() * available.length)].id;
      }
      const orderRepo = manager.getRepository(Order);
      const order = orderRepo.create({
        ...createOrderDto,
        status: createOrderDto.status || 'pending',
        user: { id: createOrderDto.userId } as User,
        pet: { id: createOrderDto.petId } as Pet,
        feeder: { id: feederId } as Feeder,
      });
      const saved = await orderRepo.save(order);
      return orderRepo.findOne({
        where: { id: saved.id },
        relations: ['user', 'pet', 'feeder'],
      });
    });
  }

  findAll() {
    return this.ordersRepository.find({ relations: ['user', 'pet', 'feeder'] });
  }

  findByUser(userId: number) {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'pet', 'feeder'],
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'pet', 'feeder'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.ordersRepository.update(id, updateOrderDto);
  }

  remove(id: number) {
    return this.ordersRepository.delete(id);
  }
}
