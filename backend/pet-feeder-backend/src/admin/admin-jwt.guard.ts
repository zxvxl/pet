import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard ensuring the JWT belongs to an administrator.
 * It extends the default passport 'jwt' guard and verifies
 * the user role contained in the token payload.
 */
@Injectable()
export class AdminJwtGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.role !== 'super' && user.role !== 'operator') {
      throw new UnauthorizedException('admin access only');
    }
    return user;
  }
}
