// backend/pet-feeder-backend/src/domains/feeders/dto/audit-feeder.dto.ts

import { IsString, IsIn, IsOptional } from 'class-validator';

export class AuditFeederDto {
  @IsString()
  @IsIn(['approve', 'reject'])
  action: 'approve' | 'reject';

  @IsOptional()
  @IsString()
  rejection_reason?: string;
}