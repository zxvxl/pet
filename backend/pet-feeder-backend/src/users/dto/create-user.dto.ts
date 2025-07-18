import { IsOptional, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  openid: string;

  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @Matches(/^\d{11}$/)
  phone?: string;

  @IsOptional()
  role?: string;
}
