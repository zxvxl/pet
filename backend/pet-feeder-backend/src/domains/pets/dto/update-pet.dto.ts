import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';

// 👉 模块：更新宠物 DTO
/** 所有字段均为可选，用于更新宠物 */
export class UpdatePetDto extends PartialType(CreatePetDto) {}
