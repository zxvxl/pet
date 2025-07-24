import { Controller, Get, Post, Body, Req, UseGuards, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminJwtGuard } from './admin-jwt.guard';
import { AdminAuthInfoDto } from './dto/admin-auth-info.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private readonly adminUserService: AdminUserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async adminLogin(@Body() loginDto: AdminLoginDto) {
    const { username, password } = loginDto;
    
    // 查找管理员用户
    const adminUser = await this.adminUserService.findByUsername(username);
    if (!adminUser) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    
    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    
    // 获取用户角色 - 确保至少有一个有效角色
    const roles = adminUser.roles?.map((r) => r.code) || [];
    if (roles.length === 0) {
      throw new UnauthorizedException('用户未分配任何管理角色');
    }
    
    // 生成JWT token
    const payload = { 
      sub: adminUser.id, 
      username: adminUser.username,
      roles 
    };
    const access_token = await this.jwtService.signAsync(payload);
    
    return {
      access_token,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        nickname: adminUser.nickname,
        email: adminUser.email,
        roles
      }
    };
  }

  @UseGuards(AdminJwtGuard)
  @Get('info')
  async getAdminInfo(@Req() req): Promise<AdminAuthInfoDto> {
    const userId = req.user.userId;
    const adminUser = await this.adminUserService.findById(userId);
    
    if (!adminUser) {
      throw new NotFoundException('Admin user not found');
    }
    
    // 获取角色信息
    const roles = adminUser.roles?.map((r) => r.code) || [];
    
    // 简化权限和菜单返回，避免实体关系问题
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
