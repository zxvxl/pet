import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';

@Injectable()
export class PetsService {
  constructor(
    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
  ) {}

  create(createPetDto: CreatePetDto) {
    const pet = this.petsRepository.create({
      ...createPetDto,
      user: { id: createPetDto.userId } as any,
    });
    return this.petsRepository.save(pet);
  }

  findAll() {
    return this.petsRepository.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.petsRepository.findOne({ where: { id }, relations: ['user'] });
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return this.petsRepository.update(id, updatePetDto);
  }

  remove(id: number) {
    return this.petsRepository.delete(id);
  }
}
