import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminPermission } from './entities/admin-permission.entity';
import { CreateAdminPermissionDto } from './dto/create-admin-permission.dto';
import { UpdateAdminPermissionDto } from './dto/update-admin-permission.dto';

@Injectable()
export class AdminPermissionService {
  constructor(
    @InjectRepository(AdminPermission)
    private permRepo: Repository<AdminPermission>,
  ) {}

  findAll() {
    return this.permRepo.find();
  }

  findById(id: number) {
    return this.permRepo.findOne({ where: { id } });
  }

  create(dto: CreateAdminPermissionDto) {
    const perm = this.permRepo.create(dto);
    return this.permRepo.save(perm);
  }

  async update(id: number, dto: UpdateAdminPermissionDto) {
    const perm = await this.permRepo.findOneOrFail({ where: { id } });
    if (dto.name !== undefined) perm.name = dto.name;
    if (dto.code !== undefined) perm.code = dto.code;
    if (dto.type !== undefined) perm.type = dto.type;
    if (dto.description !== undefined) perm.description = dto.description;
    return this.permRepo.save(perm);
  }

  remove(id: number) {
    return this.permRepo.delete(id);
  }
}
