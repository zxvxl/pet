import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbacks: Repository<Feedback>,
    @InjectRepository(Order)
    private orders: Repository<Order>,
  ) {}

  async create(userId: number, dto: CreateFeedbackDto) {
    const entity = this.feedbacks.create({
      order: { id: dto.orderId } as Order,
      user: { id: userId } as any,
      type: dto.type,
      description: dto.description,
      images: dto.images,
      contact: dto.contact,
    });
    return this.feedbacks.save(entity);
  }

  findAll() {
    return this.feedbacks.find({ relations: ['user', 'order'] });
  }
}
