import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ImService {
  constructor(
    @InjectRepository(Message)
    private messagesRepo: Repository<Message>,
  ) {}

  async send(userId: number, dto: SendMessageDto) {
    const msg = this.messagesRepo.create({
      ...dto,
      senderId: userId,
      timestamp: Date.now(),
    });
    await this.messagesRepo.save(msg);
    return msg;
  }

  async history(orderId: number, limit = 20, before?: number) {
    const qb = this.messagesRepo
      .createQueryBuilder('m')
      .where('m.orderId = :orderId', { orderId })
      .orderBy('m.timestamp', 'DESC')
      .take(limit);
    if (before) qb.andWhere('m.timestamp < :before', { before });
    return qb.getMany();
  }
}
