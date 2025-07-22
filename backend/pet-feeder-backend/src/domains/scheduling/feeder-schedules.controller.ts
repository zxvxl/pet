import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { FeederSchedulesService } from './feeder-schedules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BatchScheduleDto } from './dto/batch-schedule.dto';
import { AdminJwtGuard } from '../admin/admin-jwt.guard';

@Controller('feeder-schedules')
export class FeederSchedulesController {
  constructor(private readonly service: FeederSchedulesService) {}

  @Post('batch')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('feeder')
  async batch(@Req() req, @Body() dto: BatchScheduleDto) {
    const feederId = await this.service.findFeederIdByUser(req.user.id);
    if (!feederId) throw new NotFoundException('feeder not found');
    return this.service.saveBatch(feederId, dto.items);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('feeder')
  async getMine(@Req() req) {
    const feederId = await this.service.findFeederIdByUser(req.user.id);
    if (!feederId) throw new NotFoundException('feeder not found');
    return this.service.findByFeeder(feederId);
  }

  @Get('available')
  async available(@Query('start') start: string, @Query('end') end: string) {
    const s = new Date(start);
    const e = end ? new Date(end) : new Date(start);
    return this.service.findAvailableFeeders(s, e);
  }

  @Get()
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('name') name?: string,
  ) {
    const p = parseInt(page, 10) || 1;
    const l = parseInt(limit, 10) || 10;
    return this.service.paginateAll(p, l, name);
  }

  @Get(':feederId')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  getByFeeder(@Param('feederId') feederId: string) {
    return this.service.findByFeeder(Number(feederId));
  }

  @Put(':feederId')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  updateByFeeder(
    @Param('feederId') feederId: string,
    @Body() dto: BatchScheduleDto,
  ) {
    return this.service.saveBatch(Number(feederId), dto.items);
  }
}
