import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminUserDto } from './create-admin-user.dto';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

export class UpdateAdminUserDto extends PartialType(CreateAdminUserDto) {
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsArray()
  roleIds?: number[];
}
