// Mock数据文件

// 定义通用的响应结构
interface MockResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 模拟用户信息
const mockUserInfo: MockResponse<any> = {
  code: 200,
  data: {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    avatar: '',
    email: 'admin@example.com',
    role: 'admin',
  },
  message: 'success',
};

// 模拟菜单数据
const mockMenus: MockResponse<any[]> = {
  code: 200,
  data: [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
    },
  ],
  message: 'success',
};

// 导出所有mock数据
export default [
  // 用户信息相关mock
  {
    url: '/admin/me',
    method: 'GET',
    enable: true,
    data: mockUserInfo,
    response: () => mockUserInfo,
  },
  
  // 菜单相关mock
  {
    url: '/admin/menus',
    method: 'GET',
    enable: true,
    data: mockMenus,
    response: () => mockMenus,
  },
  
  // 登录相关mock
  {
    url: '/admin/login',
    method: 'POST',
    enable: true,
    data: {
      code: 200,
      data: {
        token: 'mock-token',
      },
      message: '登录成功',
    },
    response: () => ({
      code: 200,
      data: {
        token: 'mock-token',
      },
      message: '登录成功',
    }),
  },
];