import { Body, Controller, Get, Post, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminRole } from './admin-role.enum';
import { AdminService } from './admin.service';
import { AuditFeederDto } from './dto/audit-feeder.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Get('feeders')
  @Roles('admin')
  getFeeders(@Query('status') status?: string) {
    const s = status ? parseInt(status, 10) : undefined;
    return this.service.findFeeders(s);
  }

  @Post('feeders/audit')
  @Roles('admin')
  auditFeeder(@Body() dto: AuditFeederDto) {
    return this.service.auditFeeder(dto);
  }

  @Patch('feeders/:id/audit')
  @Roles('admin')
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
  @Roles('admin')
  updateOrderStatus(@Body() dto: UpdateOrderStatusDto) {
    return this.service.updateOrderStatus(dto);
  }
}
