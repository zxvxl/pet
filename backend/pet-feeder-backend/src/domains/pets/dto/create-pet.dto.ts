// 👉 模块：创建宠物 DTO
export class CreatePetDto {
  /** 所属用户ID */
  userId: number;
  /** 宠物昵称 */
  name: string;
  /** 宠物品种 */
  species: string;
  /** 年龄，可选 */
  age?: number;
  /** 备注，可选 */
  notes?: string;
}
