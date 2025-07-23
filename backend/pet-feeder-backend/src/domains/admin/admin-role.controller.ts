import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AdminRoleService } from './admin-role.service';
import { CreateAdminRoleDto } from './dto/create-admin-role.dto';
import { UpdateAdminRoleDto } from './dto/update-admin-role.dto';
import { AdminRoleDto } from './dto/admin-role.dto';

@Controller('admin/roles')
export class AdminRoleController {
  constructor(private readonly service: AdminRoleService) {}

  @Get()
  async findAll(): Promise<AdminRoleDto[]> {
    const roles = await this.service.findAll();
    return roles.map((r) => new AdminRoleDto(r));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminRoleDto> {
    const role = await this.service.findById(Number(id));
    return new AdminRoleDto(role!);
  }

  @Post()
  async create(@Body() dto: CreateAdminRoleDto): Promise<AdminRoleDto> {
    const role = await this.service.create(dto);
    return new AdminRoleDto(role);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdminRoleDto): Promise<AdminRoleDto> {
    const role = await this.service.update(Number(id), dto);
    return new AdminRoleDto(role);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
