import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AdminPermissionService } from './admin-permission.service';
import { CreateAdminPermissionDto } from './dto/create-admin-permission.dto';
import { UpdateAdminPermissionDto } from './dto/update-admin-permission.dto';
import { AdminPermissionDto } from './dto/admin-permission.dto';

@Controller('admin/permissions')
export class AdminPermissionController {
  constructor(private readonly service: AdminPermissionService) {}

  @Get()
  async findAll(): Promise<AdminPermissionDto[]> {
    const list = await this.service.findAll();
    return list.map((p) => new AdminPermissionDto(p));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminPermissionDto> {
    const perm = await this.service.findById(Number(id));
    return new AdminPermissionDto(perm!);
  }

  @Post()
  async create(@Body() dto: CreateAdminPermissionDto): Promise<AdminPermissionDto> {
    const perm = await this.service.create(dto);
    return new AdminPermissionDto(perm);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAdminPermissionDto,
  ): Promise<AdminPermissionDto> {
    const perm = await this.service.update(Number(id), dto);
    return new AdminPermissionDto(perm);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
