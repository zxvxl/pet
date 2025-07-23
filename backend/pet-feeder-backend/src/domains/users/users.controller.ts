// 👉 模块：用户管理接口
import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
/**
 * 用户接口控制器
 */
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  /** 创建用户 */
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin')
  /** 获取用户列表 */
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  /** 根据ID获取用户 */
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('profile')
  @Roles('user')
  getProfile(@Req() req) {
    const userId = req.user.userId;
    return this.usersService.findOne(userId);
  }

  @Put('profile')
  @Roles('user')
  updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;
    return this.usersService.update(userId, updateUserDto);
  }

  @Patch(':id')
  /** 更新用户 */
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  /** 删除用户 */
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
