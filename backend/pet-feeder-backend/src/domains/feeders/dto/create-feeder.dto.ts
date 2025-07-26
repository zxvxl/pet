// backend/pet-feeder-backend/src/domains/feeders/dto/create-feeder.dto.ts

import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, IsPhoneNumber, IsIdCard } from 'class-validator';

export class CreateFeederDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsString()
  name: string;

  @IsPhoneNumber('CN')
  phone: string;

  @IsOptional()
  @IsIdCard()
  id_card?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  @IsArray()
  certificates?: string[];

  @IsOptional()
  @IsNumber()
  status?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}