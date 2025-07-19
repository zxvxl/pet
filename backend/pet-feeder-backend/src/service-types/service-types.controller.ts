import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServiceTypesService } from './service-types.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import { UpdateServiceTypeDto } from './dto/update-service-type.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('service-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServiceTypesController {
  constructor(private readonly serviceTypesService: ServiceTypesService) {}

  @Post()
  @Roles('operator', 'super')
  create(@Body() dto: CreateServiceTypeDto) {
    return this.serviceTypesService.create(dto);
  }

  @Get()
  @Roles('user', 'operator', 'super')
  findAll() {
    return this.serviceTypesService.findAll();
  }

  @Get(':id')
  @Roles('user', 'operator', 'super')
  findOne(@Param('id') id: string) {
    return this.serviceTypesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('operator', 'super')
  update(@Param('id') id: string, @Body() dto: UpdateServiceTypeDto) {
    return this.serviceTypesService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('operator', 'super')
  remove(@Param('id') id: string) {
    return this.serviceTypesService.remove(+id);
  }
}
