import { AdminUser } from '../entities/admin-user.entity';
import { AdminRoleDto } from './admin-role.dto';

export class AdminUserDto {
  id: number;
  username: string;
  nickname?: string | null;
  email?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: AdminRoleDto[];

  constructor(user: AdminUser) {
    this.id = user.id;
    this.username = user.username;
    this.nickname = user.nickname ?? null;
    this.email = user.email ?? null;
    this.phone = user.phone ?? null;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.roles = Array.isArray(user.roles) ? user.roles.map((r) => new AdminRoleDto(r)) : [];
  }
}
