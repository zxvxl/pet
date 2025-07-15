import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminUser } from './entities/admin-user.entity';
import { AdminOperationLog } from './entities/admin-operation-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feeder, Order, AdminUser, AdminOperationLog]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
