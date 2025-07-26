import { AdminRole } from '../entities/admin-role.entity';

export class AdminRoleDto {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];

  constructor(role: AdminRole) {
    this.id = role.id;
    this.name = role.name;
    this.code = role.code;
    this.description = role.description ?? null;
    this.createdAt = role.created_at;
    this.updatedAt = role.updated_at;
    this.permissions = Array.isArray(role.permissions)
      ? role.permissions.map((p) => p.code)
      : [];
  }
}
