import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import { AdminJwtGuard } from './admin-jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { AuditFeederDto } from './dto/audit-feeder.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { HandleComplaintDto } from './dto/handle-complaint.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  @Post('login')
  async login(@Body() dto: AdminLoginDto) {
    const res = await this.service.login(dto.username, dto.password);
    if (!res) throw new UnauthorizedException();
    return res;
  }

  @Get('profile')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  profile(@Req() req) {
    return this.service.profile(req.user.userId);
  }

  @Get('feeders')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  getFeeders(@Query('status') status?: string) {
    const s = status ? parseInt(status, 10) : undefined;
    return this.service.findFeeders(s);
  }

  @Delete('feeders/:id')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super')
  removeFeeder(@Param('id') id: string, @Req() req) {
    return this.service.removeFeeder(parseInt(id, 10), req.user.userId);
  }

  @Post('feeders/audit')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  auditFeeder(@Req() req, @Body() dto: AuditFeederDto) {
    return this.service.auditFeeder(dto, req.user.userId);
  }

  @Patch('feeders/:id/audit')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  auditFeederById(
    @Param('id') id: string,
    @Body() dto: Omit<AuditFeederDto, 'feederId'>,
    @Req() req,
  ) {
    return this.service.auditFeeder(
      {
        feederId: parseInt(id, 10),
        approve: dto.approve,
        reason: dto.reason,
      },
      req.user.userId,
    );
  }

  @Post('orders/update-status')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  updateOrderStatus(@Req() req, @Body() dto: UpdateOrderStatusDto) {
    return this.service.updateOrderStatus(dto, req.user.userId);
  }

  @Get('complaints')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  getComplaints(@Query('status') status?: string) {
    return this.service.listComplaints(status);
  }

  @Patch('complaints/:id')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  handleComplaint(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: HandleComplaintDto,
  ) {
    return this.service.handleComplaint(Number(id), req.user.userId, dto);
  }

  @Get('feedback')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  getFeedback() {
    return this.service.listFeedback();
  }

  @Get('logs')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('super', 'operator')
  getLogs() {
    return this.service.listLogs();
  }
}
