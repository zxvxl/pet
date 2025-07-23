import { AdminUser } from '../entities/admin-user.entity';

export class AdminAuthInfoDto {
  id: number;
  username: string;
  nickname?: string | null;
  roles: string[];
  permissions: string[];
  menus: any[];

  constructor(user: AdminUser, permissions: string[] = [], menus: any[] = []) {
    this.id = user.id;
    this.username = user.username;
    this.nickname = user.nickname ?? null;
    this.roles = user.roles?.map((r) => r.code) || [];
    this.permissions = permissions;
    this.menus = menus;
  }
}
