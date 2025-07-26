// backend/pet-feeder-backend/src/domains/feeders/dto/batch-update.dto.ts

import { IsArray, IsString, IsOptional, IsNumber } from 'class-validator';

export class BatchUpdateDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];

  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @IsOptional()
  @IsNumber()
  status?: number;
}