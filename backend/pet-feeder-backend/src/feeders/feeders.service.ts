import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeederDto } from './dto/create-feeder.dto';
import { UpdateFeederDto } from './dto/update-feeder.dto';
import { Feeder } from './entities/feeder.entity';

@Injectable()
export class FeedersService {
  constructor(
    @InjectRepository(Feeder)
    private feedersRepository: Repository<Feeder>,
  ) {}

  create(createFeederDto: CreateFeederDto) {
    const feeder = this.feedersRepository.create(createFeederDto);
    return this.feedersRepository.save(feeder);
  }

  findAll() {
    return this.feedersRepository.find();
  }

  findOne(id: number) {
    return this.feedersRepository.findOne({ where: { id } });
  }

  update(id: number, updateFeederDto: UpdateFeederDto) {
    return this.feedersRepository.update(id, updateFeederDto);
  }

  remove(id: number) {
    return this.feedersRepository.delete(id);
  }
}
