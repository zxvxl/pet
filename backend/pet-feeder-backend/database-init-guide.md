# 宠物喂食器管理系统 - 数据库初始化指南

## 概述
本文档提供了宠物喂食器管理系统数据库的完整初始化方案，包括管理员用户、角色、权限和菜单的初始化。

## 数据库初始化步骤

### 1. 创建数据库
```sql
CREATE DATABASE IF NOT EXISTS `pet_feeder_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pet_feeder_db`;
```

### 2. 执行初始化脚本
```bash
# 进入后端目录
cd /Users/zz/Documents/zplan/pet/backend/pet-feeder-backend

# 使用MySQL命令行执行脚本
mysql -u your_username -p pet_feeder_db < database-init.sql

# 或者使用MySQL客户端连接后执行
mysql> source database-init.sql
```

### 3. 验证初始化结果
执行以下SQL检查初始化是否成功：

```sql
-- 检查管理员用户
SELECT * FROM admin_user WHERE username = 'admin';

-- 检查角色
SELECT * FROM admin_role;

-- 检查权限
SELECT * FROM admin_permission LIMIT 10;

-- 检查菜单
SELECT * FROM admin_menu ORDER BY sort ASC;

-- 检查关联关系
SELECT u.username, r.name as role_name 
FROM admin_user u 
JOIN admin_user_role ur ON u.id = ur.user_id 
JOIN admin_role r ON ur.role_id = r.id 
WHERE u.username = 'admin';
```

## 系统访问信息

### 管理员登录
- **用户名**: admin
- **密码**: admin123
- **登录地址**: http://localhost:5173

### 系统架构
- **前端地址**: http://localhost:5173
- **后端地址**: http://localhost:3001
- **API文档**: http://localhost:3001/api

## 权限体系说明

### 角色层级
1. **超级管理员** - 拥有系统所有权限
2. **系统管理员** - 拥有大部分系统管理权限
3. **订单管理员** - 负责订单相关管理
4. **设备管理员** - 负责喂食器设备管理
5. **客服专员** - 负责投诉处理

### 权限分类
- **系统管理**: 系统配置、监控、日志
- **用户管理**: 管理员用户、普通用户管理
- **订单管理**: 订单查看、状态管理
- **设备管理**: 喂食器设备管理
- **投诉管理**: 投诉查看、处理
- **数据统计**: 系统数据统计分析

### 菜单结构
```
├── 数据统计 (dashboard:view)
├── 用户管理
│   ├── 管理员用户 (user:manage)
│   └── 普通用户 (user:view)
├── 订单管理
│   ├── 订单列表 (order:view)
│   └── 订单统计 (order:manage)
├── 设备管理
│   ├── 喂食器列表 (feeder:view)
│   └── 设备状态 (feeder:manage)
├── 投诉管理
│   ├── 投诉列表 (complaint:view)
│   └── 投诉统计 (complaint:handle)
├── 系统管理
│   ├── 角色管理 (role:manage)
│   ├── 权限管理 (permission:manage)
│   ├── 菜单管理 (menu:manage)
│   └── 操作日志 (log:view)
└── 系统监控 (system:monitor)
```

## 常见问题解决

### 1. 密码重置
如果需要重置管理员密码：
```sql
-- 重置密码为 admin123
UPDATE admin_user 
SET password = '$2b$10$8K1p/kVGKpDH0WJ8XP3Rhe6vTq9jB8mGKrXkJ8J3J3J3J3J3J3J3' 
WHERE username = 'admin';
```

### 2. 添加新管理员
```sql
-- 创建新管理员用户（密码：newpass123）
INSERT INTO admin_user (username, password, salt, nickname, email, phone, is_active) 
VALUES (
    'newadmin', 
    '$2b$10$8K1p/kVGKpDH0WJ8XP3Rhe6vTq9jB8mGKrXkJ8J3J3J3J3J3J3J3', 
    '$2b$10$8K1p/kVGKpDH0WJ8XP3Rhe',
    '新管理员',
    'newadmin@petfeeder.com',
    '13900139000',
    1
);

-- 分配超级管理员角色
INSERT INTO admin_user_role (user_id, role_id) 
VALUES ((SELECT id FROM admin_user WHERE username = 'newadmin'), 1);
```

### 3. 权限调试
检查用户权限：
```sql
-- 查看用户拥有的所有权限
SELECT u.username, p.name as permission_name, p.code as permission_code
FROM admin_user u
JOIN admin_user_role ur ON u.id = ur.user_id
JOIN admin_role_permission rp ON ur.role_id = rp.role_id
JOIN admin_permission p ON rp.permission_id = p.id
WHERE u.username = 'admin'
ORDER BY p.code;
```

### 4. 数据库备份
```bash
# 备份数据库
mysqldump -u your_username -p pet_feeder_db > pet_feeder_backup.sql

# 恢复数据库
mysql -u your_username -p pet_feeder_db < pet_feeder_backup.sql
```

## 技术栈信息

### 后端技术栈
- **框架**: Nest.js
- **数据库**: MySQL 8.0+
- **ORM**: TypeORM
- **认证**: JWT
- **加密**: bcrypt

### 前端技术栈
- **框架**: Vue 3
- **构建工具**: Vite
- **UI组件**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4

## 后续扩展

### 添加新权限
```sql
-- 添加新权限
INSERT INTO admin_permission (name, code, type, description) 
VALUES ('新权限', 'new:permission', 'action', '新权限描述');

-- 关联到角色
INSERT INTO admin_role_permission (role_id, permission_id) 
VALUES (1, (SELECT id FROM admin_permission WHERE code = 'new:permission'));
```

### 添加新菜单
```sql
-- 添加新菜单
INSERT INTO admin_menu (parent_id, name, path, component, icon, sort, is_show, permission_code) 
VALUES (1, '新功能', '/system/new', 'system/new/index', 'plus', 5, 1, 'new:permission');

-- 关联到角色
INSERT INTO admin_role_menu (role_id, menu_id) 
VALUES (1, (SELECT id FROM admin_menu WHERE path = '/system/new'));
```

## 联系支持
如遇到问题，请检查：
1. 数据库连接配置
2. 端口占用情况
3. 日志文件查看
4. 网络连接状态