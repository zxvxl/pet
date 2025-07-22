import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { FeederOrdersService } from './feeder-orders.service';
import { CreateFeederOrderDto } from './dto/create-feeder-order.dto';
import { CompleteFeederOrderDto } from './dto/complete-feeder-order.dto';
import { PaginateFeederOrderDto } from './dto/paginate-feeder-order.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { FeedersService } from '../feeders/feeders.service';

@Controller('feeder-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeederOrdersController {
  constructor(
    private readonly service: FeederOrdersService,
    private readonly feedersService: FeedersService,
  ) {}

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

  /** 当前喂养员订单列表 */
  @Get('my')
  @Roles('feeder')
  async my(@Req() req, @Query() query: PaginateFeederOrderDto) {
    const feeder = await this.feedersService.findByUserId(req.user.userId);
    if (!feeder) {
      throw new NotFoundException('Feeder not found');
    }
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    return this.service.paginateByFeeder(feeder.id, page, limit);
  }

  /** 确认订单 */
  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.service.confirm(+id);
  }

  /** 新接口：接受订单 */
  @Post(':id/accept')
  @Roles('feeder')
  accept(@Param('id') id: string) {
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

  /** 签到 */
  @Patch(':id/sign-in')
  signIn(@Param('id') id: string, @Body() dto: SignInDto) {
    return this.service.signIn(+id, dto);
  }

  /** 出发 */
  @Patch(':id/depart')
  depart(@Param('id') id: string) {
    return this.service.depart(+id);
  }

  /** 新接口：开始服务 */
  @Post(':id/start-service')
  @Roles('feeder')
  startService(@Param('id') id: string) {
    return this.service.start(+id);
  }

  /** 完成服务并上传图片、备注 */
  @Patch(':id/complete')
  complete(@Param('id') id: string, @Body() dto: CompleteFeederOrderDto) {
    return this.service.complete(+id, dto);
  }

  /** 新接口：完成服务并上传图片、备注 */
  @Post(':id/complete-service')
  @Roles('feeder')
  completeService(@Param('id') id: string, @Body() dto: CompleteFeederOrderDto) {
    return this.service.complete(+id, dto);
  }

  /** 取消服务 */
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.service.cancel(+id);
  }
}
