import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminRole } from './admin-role.enum';
import { AdminService } from './admin.service';
import { AuditFeederDto } from './dto/audit-feeder.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('login')
  @UseGuards()
  login(@Body() dto: AdminLoginDto) {
    return this.service.login(dto.username, dto.password);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  profile(@Req() req) {
    return this.service.profile(req.user.userId);
  }

  @Get('feeders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super', 'operator')
  getFeeders(@Query('status') status?: string) {
    const s = status ? parseInt(status, 10) : undefined;
    return this.service.findFeeders(s);
  }

  @Post('feeders/audit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super', 'operator')
  auditFeeder(@Body() dto: AuditFeederDto) {
    return this.service.auditFeeder(dto);
  }

  @Patch('feeders/:id/audit')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super', 'operator')
  auditFeederById(
    @Param('id') id: string,
    @Body() dto: Omit<AuditFeederDto, 'feederId'>,
  ) {
    return this.service.auditFeeder({
      feederId: parseInt(id, 10),
      approve: dto.approve,
      reason: dto.reason,
    });
  }

  @Post('orders/update-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super', 'operator')
  updateOrderStatus(@Body() dto: UpdateOrderStatusDto) {
    return this.service.updateOrderStatus(dto);
  }
}
