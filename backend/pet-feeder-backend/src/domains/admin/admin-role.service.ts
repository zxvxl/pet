import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminRole } from './entities/admin-role.entity';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';

@Injectable()
export class AdminRoleService {
  constructor(@InjectRepository(AdminRole) private roleRepo: Repository<AdminRole>) {}

  findAll() {
    return this.roleRepo.find({ relations: ['permissions'] });
  }

  findById(id: number) {
    return this.roleRepo.findOne({ where: { id }, relations: ['permissions'] });
  }

  create(dto: CreateAdminRoleDto) {
    const role = this.roleRepo.create(dto);
    return this.roleRepo.save(role);
  }

  async update(id: number, dto: UpdateAdminRoleDto) {
    const role = await this.roleRepo.findOneOrFail({ where: { id } });
    if (dto.name !== undefined) role.name = dto.name;
    if (dto.code !== undefined) role.code = dto.code;
    if (dto.description !== undefined) role.description = dto.description;
    return this.roleRepo.save(role);
  }

  remove(id: number) {
    return this.roleRepo.delete(id);
  }
}
