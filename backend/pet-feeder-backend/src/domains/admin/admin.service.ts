import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Feeder } from '../feeders/entities/feeder.entity';
import { Order } from '../orders/entities/order.entity';
import { Complaint } from '../complaints/entities/complaint.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { AdminUser } from './entities/admin-user.entity';
import { AdminOperationLog } from './entities/admin-operation-log.entity';
import { AdminRole } from './entities/admin-role.entity';
import { AuditFeederDto } from './dto/audit-feeder.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { HandleComplaintDto } from './dto/handle-complaint.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Feeder)
    private feedersRepository: Repository<Feeder>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(AdminUser)
    private adminRepository: Repository<AdminUser>,
    @InjectRepository(AdminRole)
    private roleRepository: Repository<AdminRole>,
    @InjectRepository(AdminOperationLog)
    private logRepository: Repository<AdminOperationLog>,
    private jwtService: JwtService,
  ) {}

  async findFeeders(status?: number) {
    return this.feedersRepository.find({ where: status ? { status } : {} });
  }

  async auditFeeder(dto: AuditFeederDto, adminId: number) {
    const status = dto.approve ? 1 : 2;
    const result = await this.feedersRepository.update(dto.feederId, {
      status,
      reject_reason: dto.approve ? undefined : dto.reason,
    });
    await this.logOperation(dto.feederId, 'feeder', `audit:${dto.approve}`, dto.reason, adminId);
    return result;
  }

  async updateOrderStatus(dto: UpdateOrderStatusDto, adminId: number) {
    const res = await this.ordersRepository.update(dto.orderId, { status: dto.status });
    await this.logOperation(dto.orderId, 'order', `status:${dto.status}`, undefined, adminId);
    return res;
  }

  async removeFeeder(id: number, adminId: number) {
    const res = await this.feedersRepository.delete(id);
    await this.logOperation(id, 'feeder', 'delete', undefined, adminId);
    return res;
  }

  async createAdminUser(
    username: string,
    password: string,
    roleCode: string,
  ) {
    const role = await this.roleRepository.findOne({ where: { code: roleCode } });
    if (!role) {
      throw new Error('role not found');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = this.adminRepository.create({
      username,
      password: hash,
      roles: [role],
    });
    return this.adminRepository.save(user);
  }

  async findByUsername(username: string) {
    return this.adminRepository.findOne({
      where: { username },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async validateUser(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    if (!match || !user.is_active) return null;
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    if (!user) return null;
    const roles = user.roles.map((r) => r.code);
    const permissions = user.roles.flatMap((r) =>
      Array.isArray(r.permissions) ? r.permissions.map((p) => p.code) : [],
    );
    const payload = { sub: user.id, roles, permissions };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  async profile(userId: number) {
    return this.adminRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async listComplaints(status?: string) {
    return this.complaintsRepository.find({
      where: status ? { status } : {},
      relations: ['user', 'handled_by', 'related_order'],
    });
  }

  async handleComplaint(id: number, adminId: number, dto: HandleComplaintDto) {
    const result = await this.complaintsRepository.update(id, {
      status: dto.status,
      result: dto.result,
      handled_by: { id: adminId } as AdminUser,
      handled_at: new Date(),
    });
    await this.logOperation(id, 'complaint', `update:${dto.status}`, undefined, adminId);
    return result;
  }

  async listFeedback() {
    return this.feedbackRepository.find({ relations: ['user', 'order'] });
  }

  async listLogs() {
    return this.logRepository.find({ relations: ['user'], order: { id: 'DESC' } });
  }

  private async logOperation(targetId: number, targetType: string, action: string, detail?: string, userId?: number) {
    const log = this.logRepository.create({
        user: { id: userId || 0 } as any,
        target_id: targetId,
        target_type: targetType,
        action,
        detail,
      });
    await this.logRepository.save(log);
  }
  async findById(id: number) {
    return this.adminRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

}
