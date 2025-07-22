import { Body, Controller, Get, Post, Req, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FeedersService } from './feeders.service';
import { ApplyFeederDto } from './dto/apply-feeder.dto';
import { FeederSchedulesService } from '../scheduling/feeder-schedules.service';
import { BatchScheduleDto } from '../scheduling/dto/batch-schedule.dto';

@Controller('feeder')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeederSelfController {
  constructor(
    private readonly service: FeedersService,
    private readonly schedules: FeederSchedulesService,
  ) {}

  @Post('apply')
  @Roles('user')
  apply(@Req() req, @Body() dto: ApplyFeederDto) {
    return this.service.apply(req.user.id, dto);
  }

  @Get('profile')
  @Roles('user', 'feeder', 'admin')
  profile(@Req() req) {
    return this.service.findByUserId(req.user.id);
  }

  /** 提交排班计划 */
  @Post('schedule')
  @Roles('feeder')
  submitSchedule(@Req() req, @Body() dto: BatchScheduleDto) {
    return this.schedules.saveForUser(req.user.id, dto.items);
  }

  /** 获取排班信息，可指定喂养员 */
  @Get('schedule')
  @Roles('feeder', 'operator', 'super')
  getSchedule(@Req() req, @Query('feederId') feederId?: string) {
    const id = feederId ? parseInt(feederId, 10) : req.user.id;
    return this.schedules.listForUser(id);
  }
}
