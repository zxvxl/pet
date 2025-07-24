import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  openid: string;

  @IsString()
  nickname: string;

  @IsString()
  avatar: string;
}
