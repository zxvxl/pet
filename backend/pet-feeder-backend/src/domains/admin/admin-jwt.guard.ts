import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

/**
 * Guard ensuring the JWT belongs to an administrator.
 * It extends the passport 'admin-jwt' guard and verifies
 * the user role contained in the token payload.
 */
@Injectable()
export class AdminJwtGuard extends AuthGuard('admin-jwt') {
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    console.log(JSON.stringify(user));
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // 验证token中的用户ID - 兼容sub和userId两种字段名
    const userId = user.sub || user.userId;
    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // 验证token中的角色信息 - 兼容roles字段的各种格式
    const roles: string[] = user.roles || [];
    if (!Array.isArray(roles) || roles.length === 0) {
      throw new UnauthorizedException('No admin roles assigned');
    }

    // 角色验证已通过前面的检查，这里不需要额外验证

    // 标准化用户信息，确保controller能够正确访问
    const standardizedUser = {
      ...user,
      userId: user.sub || user.userId,
      roles: roles
    };

    return standardizedUser as TUser;
  }
}
