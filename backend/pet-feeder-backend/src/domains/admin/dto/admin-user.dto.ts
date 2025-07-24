import { AdminUser } from '../entities/admin-user.entity';
import { AdminRoleDto } from './admin-role.dto';

export class AdminUserDto {
  id: number;
  username: string;
  nickname?: string | null;
  email?: string | null;
  phone?: string | null;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: AdminRoleDto[];

  constructor(user: AdminUser) {
    this.id = user.id;
    this.username = user.username;
    this.nickname = user.nickname ?? null;
    this.email = user.email ?? null;
    this.phone = user.phone ?? null;
    this.is_active = user.is_active;
    this.createdAt = user.create_time;
    this.updatedAt = user.update_time;
    this.roles = Array.isArray(user.roles) ? user.roles.map((r) => new AdminRoleDto(r)) : [];
  }
}
