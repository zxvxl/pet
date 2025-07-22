import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';

@Injectable()
/**
 * 宠物业务服务
 * 负责宠物信息的增删查改
 */
export class PetsService {
  constructor(
    // 宠物实体仓库
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
  ) {}

  /**
   * 创建宠物信息
   */
  create(createPetDto: CreatePetDto) {
    const pet = this.petsRepository.create({
      ...createPetDto,
      user: { id: createPetDto.userId } as any,
    });
    return this.petsRepository.save(pet);
  }

  /** 获取所有宠物 */
  findAll() {
    return this.petsRepository.find({ relations: ['user'] });
  }

  /** 根据ID查询宠物 */
  findOne(id: number) {
    return this.petsRepository.findOne({ where: { id }, relations: ['user'] });
  }

  /** 更新宠物信息 */
  update(id: number, updatePetDto: UpdatePetDto) {
    return this.petsRepository.update(id, updatePetDto);
  }

  /** 删除宠物 */
  remove(id: number) {
    return this.petsRepository.delete(id);
  }
}
