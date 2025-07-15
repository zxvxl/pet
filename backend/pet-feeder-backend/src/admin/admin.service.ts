import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';
import { AdminUser } from './entities/admin-user.entity';
import { AdminRole } from './admin-role.enum';
import { AuditFeederDto } from './dto/audit-feeder.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Feeder)
    private feedersRepository: Repository<Feeder>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,
  ) {}

  async findFeeders(status?: number) {
    return this.feedersRepository.find({ where: status ? { status } : {} });
  }

  async auditFeeder(dto: AuditFeederDto) {
    const status = dto.approve ? 1 : 2;
    return this.feedersRepository.update(dto.feederId, {
      status,
    });
  }

  async updateOrderStatus(dto: UpdateOrderStatusDto) {
    return this.ordersRepository.update(dto.orderId, { status: dto.status });
  }

  async createAdminUser(username: string, password: string, role: AdminRole) {
    const user = this.adminRepository.create({ username, password, role });
    return this.adminRepository.save(user);
  }

  async findByUsername(username: string) {
    return this.adminRepository.findOne({ where: { username } });
  }
}
