import { Injectable } from '@nestjs/common';
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
  create(createUserDto: CreateUserDto) {
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

  /** 根据 openid 查询用户 */
  findByOpenid(openid: string) {
    return this.usersRepository.findOne({ where: { openid } });
  }

  /** 更新用户 */
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update(id, updateUserDto);
  }

  /** 删除用户 */
  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
