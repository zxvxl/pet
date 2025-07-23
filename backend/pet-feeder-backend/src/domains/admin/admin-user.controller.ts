import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { AdminUserDto } from './dto/admin-user.dto';

@Controller('admin/users')
export class AdminUserController {
  constructor(private readonly service: AdminUserService) {}

  @Get()
  async findAll(): Promise<AdminUserDto[]> {
    const list = await this.service.findAll();
    return list.map((u) => new AdminUserDto(u));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AdminUserDto> {
    const user = await this.service.findById(Number(id));
    return new AdminUserDto(user!);
  }

  @Post()
  async create(@Body() dto: CreateAdminUserDto): Promise<AdminUserDto> {
    const user = await this.service.create(dto);
    return new AdminUserDto(user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateAdminUserDto): Promise<AdminUserDto> {
    const user = await this.service.update(Number(id), dto);
    return new AdminUserDto(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }

  @Post(':id/roles')
  async assignRoles(@Param('id') id: string, @Body() dto: AssignRolesDto): Promise<AdminUserDto> {
    const user = await this.service.updateRoles(Number(id), dto.roleIds);
    return new AdminUserDto(user);
  }
}
