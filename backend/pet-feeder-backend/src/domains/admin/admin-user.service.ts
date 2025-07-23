import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminUser } from './entities/admin-user.entity';
import { AdminRole } from './entities/admin-role.entity';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectRepository(AdminUser) private userRepo: Repository<AdminUser>,
    @InjectRepository(AdminRole) private roleRepo: Repository<AdminRole>,
  ) {}

  findAll() {
    return this.userRepo.find({ relations: ['roles'] });
  }

  findById(id: number) {
    return this.userRepo.findOne({ where: { id }, relations: ['roles'] });
  }

  async create(dto: CreateAdminUserDto) {
    const user = this.userRepo.create({
      username: dto.username,
      nickname: dto.nickname,
      email: dto.email,
      phone: dto.phone,
      isActive: true,
    });
    user.password = await bcrypt.hash(dto.password, 10);
    if (dto.roleIds && dto.roleIds.length) {
      user.roles = await this.roleRepo.findByIds(dto.roleIds);
    } else {
      user.roles = [];
    }
    return this.userRepo.save(user);
  }

  async update(id: number, dto: UpdateAdminUserDto) {
    const user = await this.userRepo.findOneOrFail({ where: { id }, relations: ['roles'] });
    if (dto.nickname !== undefined) user.nickname = dto.nickname;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.roleIds) {
      user.roles = await this.roleRepo.findByIds(dto.roleIds);
    }
    return this.userRepo.save(user);
  }

  remove(id: number) {
    return this.userRepo.delete(id);
  }

  async updateRoles(userId: number, roleIds: number[]) {
    const user = await this.userRepo.findOneOrFail({ where: { id: userId }, relations: ['roles'] });
    user.roles = await this.roleRepo.findByIds(roleIds);
    return this.userRepo.save(user);
  }
}
