import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { FeedersService } from './feeders.service';
import { ApplyFeederDto } from './dto/apply-feeder.dto';

@Controller('feeder')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeederSelfController {
  constructor(private readonly service: FeedersService) {}

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
}
