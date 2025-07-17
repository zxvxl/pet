import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint } from './entities/complaint.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaints: Repository<Complaint>,
    @InjectRepository(Order)
    private orders: Repository<Order>,
  ) {}

  create(userId: number, dto: CreateComplaintDto) {
    const entity = this.complaints.create({
      relatedOrder: { id: dto.orderId } as Order,
      user: { id: userId } as any,
      complaintType: dto.complaintType,
      description: dto.description,
      images: dto.images,
    });
    return this.complaints.save(entity);
  }

  findOne(id: number) {
    return this.complaints.findOne({
      where: { id },
      relations: ['relatedOrder', 'user', 'handledBy'],
    });
  }
}
