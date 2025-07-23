import { IsArray } from 'class-validator';

export class AssignRolesDto {
  @IsArray()
  roleIds: number[];
}
