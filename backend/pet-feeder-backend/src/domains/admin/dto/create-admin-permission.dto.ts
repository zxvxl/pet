import { IsOptional, IsString } from 'class-validator';

export class CreateAdminPermissionDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
