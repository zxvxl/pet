import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FeederOrdersService } from './feeder-orders.service';
import { CreateFeederOrderDto } from './dto/create-feeder-order.dto';
import { CompleteFeederOrderDto } from './dto/complete-feeder-order.dto';
import { PaginateFeederOrderDto } from './dto/paginate-feeder-order.dto';

@Controller('feeder-orders')
export class FeederOrdersController {
  constructor(private readonly service: FeederOrdersService) {}

  /** 创建订单（测试用） */
  @Post()
  create(@Body() dto: CreateFeederOrderDto) {
    return this.service.create(dto);
  }

  /** 获取喂养员的所有订单 */
  @Get('feeder/:feederId')
  findByFeeder(
    @Param('feederId') feederId: string,
    @Query() query: PaginateFeederOrderDto,
  ) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    return this.service.paginateByFeeder(+feederId, page, limit);
  }

  /** 确认订单 */
  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.service.confirm(+id);
  }

  /** 拒绝订单 */
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.service.reject(+id);
  }

  /** 开始服务 */
  @Patch(':id/start')
  start(@Param('id') id: string) {
    return this.service.start(+id);
  }

  /** 完成服务并上传图片、备注 */
  @Patch(':id/complete')
  complete(@Param('id') id: string, @Body() dto: CompleteFeederOrderDto) {
    return this.service.complete(+id, dto);
  }
}
