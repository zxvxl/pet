import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintsService } from './complaints.service';
import { ComplaintsController } from './complaints.controller';
import { Complaint } from './entities/complaint.entity';
import { Order } from '../orders/entities/order.entity';
import { AdminUser } from '../admin/entities/admin-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Complaint, Order, AdminUser])],
  controllers: [ComplaintsController],
  providers: [ComplaintsService],
})
export class ComplaintsModule {}
