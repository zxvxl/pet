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
} from '@nestjs/common';
import { FeederSchedulesService } from './feeder-schedules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
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
