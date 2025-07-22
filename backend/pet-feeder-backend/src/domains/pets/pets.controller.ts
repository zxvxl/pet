// 👉 模块：宠物管理接口
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
/**
 * 宠物接口控制器
 * 提供用户管理宠物的相关 REST 接口
 */
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post()
  @Roles('user', 'operator', 'super')
  /**
   * 新增宠物
   * 请求方式：POST
   * 请求路径：/pets
   */
  create(@Body() createPetDto: CreatePetDto) {
    return this.petsService.create(createPetDto);
  }

  @Get()
  @Roles('operator', 'super')
  /** 获取所有宠物 */
  findAll() {
    return this.petsService.findAll();
  }

  @Get(':id')
  @Roles('user', 'operator', 'super')
  /** 获取单只宠物 */
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('user', 'operator', 'super')
  /** 更新宠物 */
  update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
    return this.petsService.update(+id, updatePetDto);
  }

  @Delete(':id')
  @Roles('user', 'operator', 'super')
  /** 删除宠物 */
  remove(@Param('id') id: string) {
    return this.petsService.remove(+id);
  }
}
