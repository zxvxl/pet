import { AdminRole } from '../entities/admin-role.entity';

export class AdminRoleDto {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(role: AdminRole) {
    this.id = role.id;
    this.name = role.name;
    this.code = role.code;
    this.description = role.description;
    this.createdAt = role.createdAt;
    this.updatedAt = role.updatedAt;
  }
}
