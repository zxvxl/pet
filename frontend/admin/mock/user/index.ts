import Mock from 'mockjs';
import { resultSuccess } from '../_util';
import { defineMock } from '@alova/mock';

const Random = Mock.Random;

const token = Random.string('upper', 32, 32);

const adminInfo = {
  userId: '1',
  username: 'admin',
  realName: 'Admin',
  avatar: Random.image(),
  desc: 'manager',
  password: Random.string('upper', 4, 16),
  token,
  permissions: [
    {
      label: '创建服务',
      value: 'service:create',
    },
    {
      label: '审核喂养员',
      value: 'feeder:approve',
    },
  ],
};

export default defineMock({
  '[POST]/api/admin/login': () => resultSuccess({ token }),
  '/api/admin/me': () => resultSuccess(adminInfo),
});
