import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export type Role = 'user' | 'feeder' | 'admin' | 'super' | 'operator';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
