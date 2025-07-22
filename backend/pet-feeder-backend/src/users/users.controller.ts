// 👉 模块：用户管理接口
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
  /** 获取用户列表 */
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  /** 根据ID获取用户 */
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
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
