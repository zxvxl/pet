import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeederDto } from './dto/create-feeder.dto';
import { ApplyFeederDto } from './dto/apply-feeder.dto';
import { UpdateFeederDto } from './dto/update-feeder.dto';
import { Feeder } from './entities/feeder.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FeedersService {
  constructor(
    @InjectRepository(Feeder)
    private feedersRepository: Repository<Feeder>,
  ) {}

  findByUserId(userId: number) {
    return this.feedersRepository.findOne({ where: { user: { id: userId } } });
  }

  async apply(userId: number, dto: ApplyFeederDto) {
    const existing = await this.findByUserId(userId);
    if (existing) {
      Object.assign(existing, dto, { status: 0, rejectReason: null });
      return this.feedersRepository.save(existing);
    }
    const feeder = this.feedersRepository.create({
      ...dto,
      user: { id: userId } as User,
    });
    return this.feedersRepository.save(feeder);
  }

  create(createFeederDto: CreateFeederDto) {
    const feeder = this.feedersRepository.create({
      ...createFeederDto,
      user: { id: createFeederDto.userId } as User,
    });
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

  updateStatus(id: number, status: number) {
    return this.feedersRepository.update(id, { status });
  }

  remove(id: number) {
    return this.feedersRepository.delete(id);
  }
}
