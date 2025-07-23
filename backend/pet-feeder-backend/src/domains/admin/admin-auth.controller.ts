import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminAuthInfoDto } from './dto/admin-auth-info.dto';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @UseGuards(AdminJwtGuard)
  @Get('info')
  async getAdminInfo(@Req() req): Promise<AdminAuthInfoDto> {
    const userId = req.user.userId;
    const adminUser = await this.adminUserService.findById(userId);
    const roles = adminUser?.roles?.map((r) => r.code) || [];
    const permissions: string[] = [];
    const menus: any[] = [];
    return {
      id: adminUser.id,
      username: adminUser.username,
      nickname: adminUser.nickname,
      roles,
      permissions,
      menus,
    } as AdminAuthInfoDto;
  }
}
