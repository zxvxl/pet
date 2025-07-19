import { Controller, Post, Get, Body, Req, UseGuards, Param } from '@nestjs/common';
import { ReserveOrdersService } from './reserve-orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateReserveOrderDto } from './dto/create-order.dto';

@Controller('reserve-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReserveOrdersController {
  constructor(private readonly service: ReserveOrdersService) {}

  @Post()
  @Roles('user')
  create(@Req() req, @Body() dto: CreateReserveOrderDto) {
    const userId = dto.userId || req.user.userId;
    return this.service.create(dto, userId);
  }

  @Get()
  @Roles('user')
  findMine(@Req() req) {
    return this.service.findByUser(req.user.userId);
  }

  @Get(':id')
  @Roles('user')
  findOne(@Param('id') id: string, @Req() req) {
    return this.service.findOne(+id, req.user.userId);
  }
}
