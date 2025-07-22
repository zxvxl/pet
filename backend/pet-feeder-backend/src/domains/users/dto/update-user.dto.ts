import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// 👉 模块：更新用户 DTO
/** 继承创建用户 DTO，字段均可选 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
