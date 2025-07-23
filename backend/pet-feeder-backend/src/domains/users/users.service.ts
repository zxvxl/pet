import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
/**
 * 用户业务服务
 */
export class UsersService {
  constructor(
    // 用户实体仓库
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /** 新建用户 */
  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  /** 查询所有用户 */
  findAll() {
    return this.usersRepository.find();
  }

  /** 根据ID查询用户 */
  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  /** 根据 openId 查询用户 */
  findByOpenId(openId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { openId } });
  }

  /** 根据 unionId 查询用户 */
  findByUnionId(unionId: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { unionId } });
  }

  /** 更新用户信息 */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  /** 删除用户 */
  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
