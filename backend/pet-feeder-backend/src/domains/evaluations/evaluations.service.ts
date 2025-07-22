import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { CreateAnonymousEvaluationDto } from './dto/create-anonymous-evaluation.dto';
import { Order } from '../orders/entities/order.entity';
import { Feeder } from '../feeders/entities/feeder.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluations: Repository<Evaluation>,
    @InjectRepository(Order)
    private orders: Repository<Order>,
    @InjectRepository(Feeder)
    private feeders: Repository<Feeder>,
  ) {}

  async createByUser(userId: number, dto: CreateEvaluationDto) {
    const order = await this.orders.findOne({
      where: { id: dto.orderId },
      relations: ['user', 'feeder'],
    });
    if (!order || order.user.id !== userId) {
      throw new BadRequestException('invalid order');
    }
    if (order.status !== 'completed') {
      throw new BadRequestException('order not completed');
    }
    const exists = await this.evaluations.findOne({
      where: { order: { id: dto.orderId }, role: 'user' },
    });
    if (exists) {
      throw new BadRequestException('already evaluated');
    }
    if (!order.feeder) {
      throw new BadRequestException('order has no feeder');
    }
    const entity = this.evaluations.create({
      order: { id: dto.orderId } as Order,
      user: { id: userId } as User,
      feeder: { id: order.feeder.id } as Feeder,
      role: 'user',
      star: dto.star,
      tags: dto.tags,
      content: dto.content,
      images: dto.images,
      anonymous: false,
    });
    const saved = await this.evaluations.save(entity);
    await this.updateFeederRating(order.feeder.id);
    return saved;
  }

  async createAnonymous(feederId: number, dto: CreateAnonymousEvaluationDto) {
    const order = await this.orders.findOne({
      where: { id: dto.orderId },
      relations: ['user', 'feeder'],
    });
    if (!order || order.feeder?.id !== feederId) {
      throw new BadRequestException('invalid order');
    }
    const count = await this.evaluations
      .createQueryBuilder('e')
      .where('e.feederId = :feederId', { feederId })
      .andWhere('e.userId = :userId', { userId: order.user.id })
      .andWhere("e.role = 'feeder'")
      .andWhere('DATE(e.createTime) = CURDATE()')
      .getCount();
    if (count > 0) {
      throw new BadRequestException('already evaluated today');
    }
    const entity = this.evaluations.create({
      order: { id: dto.orderId } as Order,
      user: { id: order.user.id } as User,
      feeder: { id: feederId } as Feeder,
      role: 'feeder',
      star: dto.star,
      tags: dto.tags,
      anonymous: true,
    });
    return this.evaluations.save(entity);
  }

  private async updateFeederRating(feederId: number) {
    const result = await this.evaluations
      .createQueryBuilder('e')
      .select('AVG(e.star)', 'avg')
      .where('e.feederId = :feederId', { feederId })
      .andWhere("e.role = 'user'")
      .getRawOne();
    const rating = parseFloat(result?.avg as string) || 0;
    await this.feeders.update(feederId, { rating });
  }
}
