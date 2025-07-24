import { AdminPermission } from '../entities/admin-permission.entity';

export class AdminPermissionDto {
  id: number;
  name: string;
  code: string;
  type?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(permission: AdminPermission) {
    this.id = permission.id;
    this.name = permission.name;
    this.code = permission.code;
    this.type = permission.type ?? null;
    this.description = permission.description ?? null;
    this.createdAt = permission.create_time;
    this.updatedAt = permission.update_time;
  }
}
