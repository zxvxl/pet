
// backend/pet-feeder-backend/src/domains/feeders/dto/update-feeder.dto.ts

import { PartialType } from '@nestjs/mapped-types';
import { CreateFeederDto } from './create-feeder.dto';

export class UpdateFeederDto extends PartialType(CreateFeederDto) {}

// backend/pet-feeder-backend/src/domains/feeders/dto/feeder-list.dto.ts

import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

export class FeederListDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsArray()
  dateRange?: [string, string];
}