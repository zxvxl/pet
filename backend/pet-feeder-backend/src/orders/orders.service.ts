import { Injectable } from '@nestjs/common';
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
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const order = this.ordersRepository.create({
      ...createOrderDto,
      user: { id: createOrderDto.userId } as User,
      pet: { id: createOrderDto.petId } as Pet,
      feeder: createOrderDto.feederId
        ? ({ id: createOrderDto.feederId } as Feeder)
        : undefined,
    });
    return this.ordersRepository.save(order);
  }

  findAll() {
    return this.ordersRepository.find({ relations: ['user', 'pet', 'feeder'] });
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
