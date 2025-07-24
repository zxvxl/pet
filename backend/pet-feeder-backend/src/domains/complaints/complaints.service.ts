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
      related_order: { id: dto.orderId } as Order,
      user: { id: userId } as any,
      complaint_type: dto.complaint_type,
      description: dto.description,
      images: dto.images,
    });
    return this.complaints.save(entity);
  }

  findOne(id: number) {
    return this.complaints.findOne({
      where: { id },
      relations: ['related_order', 'user', 'handled_by'],
    });
  }
}
