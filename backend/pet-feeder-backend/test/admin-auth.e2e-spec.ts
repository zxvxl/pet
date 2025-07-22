import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { AdminService } from '../src/admin/admin.service';
import { AdminUser } from '../src/admin/entities/admin-user.entity';

describe('密码验证测试', () => {
  let service: AdminService;
  const mockAdminUser = {
    id: 1,
    username: 'admin',
    password: '$2a$10$KQJ7T6jQ5Q5Q5Q5Q5Q5QeX8mPiQ2EqES', // 数据库存储的哈希
    status: 1,
    role: 'super'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(AdminUser),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockAdminUser),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('直接验证密码哈希是否匹配', async () => {
    // 1. 验证数据库记录
    console.log('数据库存储的哈希:', mockAdminUser.password);
    console.log('用户状态:', mockAdminUser.status);

    // 2. 直接测试密码对比
    const plainPassword = '123456';
    const hashCompareResult = await bcrypt.compare(plainPassword, mockAdminUser.password);
    console.log('密码对比结果:', hashCompareResult);

    // 3. 测试service层验证逻辑
    const serviceValidateResult = await service.validateUser('admin', plainPassword);
    console.log('Service验证结果:', serviceValidateResult);

    expect(hashCompareResult).toBe(true);
    expect(serviceValidateResult).not.toBeNull();
  });
});