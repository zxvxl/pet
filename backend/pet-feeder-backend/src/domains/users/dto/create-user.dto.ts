import { IsOptional, IsString, Matches } from 'class-validator';

// 👉 模块：创建用户 DTO
export class CreateUserDto {
  /** 微信 openid */
  @IsString()
  openid: string;

  /** 用户昵称 */
  @IsString()
  nickname: string;

  /** 头像 URL，可选 */
  @IsOptional()
  @IsString()
  avatar?: string;

  /** 手机号，可选，11 位数字 */
  @IsOptional()
  @Matches(/^\d{11}$/)
  phone?: string;

  /** 角色，可选 */
  @IsOptional()
  role?: string;
}
