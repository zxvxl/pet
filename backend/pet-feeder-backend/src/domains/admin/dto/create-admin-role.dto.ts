import { IsOptional, IsString } from 'class-validator';

export class CreateAdminRoleDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  description?: string;
}
