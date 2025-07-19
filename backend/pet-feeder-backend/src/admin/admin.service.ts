import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
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
    private jwtService: JwtService,
  ) {}

  async findFeeders(status?: number) {
    return this.feedersRepository.find({ where: status ? { status } : {} });
  }

  async auditFeeder(dto: AuditFeederDto) {
    const status = dto.approve ? 1 : 2;
    return this.feedersRepository.update(dto.feederId, {
      status,
      rejectReason: dto.approve ? undefined : dto.reason,
    });
  }

  async updateOrderStatus(dto: UpdateOrderStatusDto) {
    return this.ordersRepository.update(dto.orderId, { status: dto.status });
  }

  async createAdminUser(username: string, password: string, role: AdminRole) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.adminRepository.create({ username, password: hashed, role });
    return this.adminRepository.save(user);
  }

  async findByUsername(username: string) {
    return this.adminRepository.findOne({ where: { username } });
  }

  async findById(id: number) {
    return this.adminRepository.findOne({ where: { id } });
  }

  async login(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async profile(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...rest } = user;
    return rest;
  }
}
