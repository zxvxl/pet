import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ServiceOrdersService } from './service-orders.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { SignInDto } from './dto/sign-in.dto';
import { CompleteServiceDto } from './dto/complete-service.dto';

@Controller('service-orders')
export class ServiceOrdersController {
  constructor(private readonly service: ServiceOrdersService) {}

  @Post()
  create(@Body() dto: CreateServiceOrderDto) {
    return this.service.create(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id/sign-in')
  signIn(@Param('id') id: string, @Body() dto: SignInDto) {
    return this.service.signIn(+id, dto);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string, @Body() dto: CompleteServiceDto) {
    return this.service.complete(+id, dto);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(+id);
  }
}
