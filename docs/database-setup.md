# 数据库设置指南

## 📋 数据库命名规范

### 表名规范
- **业务前缀**：所有表名都使用业务前缀进行区分
  - `admin_`：管理员系统相关表
  - `user_`：普通用户系统相关表
  - `feeder_`：喂养员系统相关表
  - 其他业务模块使用相应前缀

- **命名风格**：统一使用小写+下划线命名法
  - 正确：`admin_user_role`
  - 错误：`adminUserRole` 或 `AdminUserRole`

### 字段命名规范
- **统一使用下划线命名法**：
  - 正确：`user_id`, `created_at`
  - 错误：`userId`, `createdAt`

- **时间字段**：
  - 创建时间：`created_at`
  - 更新时间：`updated_at`
  - 删除时间：`deleted_at`（软删除时使用）

- **状态字段**：
  - 布尔类型：`is_active`, `is_deleted`, `is_show`
  - 枚举类型：`status`, `type`

## 🗃️ 数据库表结构

### 管理员系统表

#### admin_user（管理员用户表）
```sql
CREATE TABLE `admin_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `salt` varchar(32) DEFAULT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### admin_role（管理员角色表）
```sql
CREATE TABLE `admin_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE,
  `code` varchar(50) NOT NULL UNIQUE,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### admin_permission（管理员权限表）
```sql
CREATE TABLE `admin_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(100) NOT NULL UNIQUE,
  `type` varchar(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### admin_menu（管理员菜单表）
```sql
CREATE TABLE `admin_menu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT '0',
  `name` varchar(50) NOT NULL,
  `path` varchar(100) DEFAULT NULL,
  `component` varchar(100) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  `sort` int DEFAULT '0',
  `is_show` tinyint(1) DEFAULT '1',
  `is_cache` tinyint(1) DEFAULT '0',
  `permission_code` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

#### 关联表
- `admin_user_role`：用户-角色关联表
- `admin_role_permission`：角色-权限关联表
- `admin_role_menu`：角色-菜单关联表

## 🚀 数据库初始化

### 1. 执行初始化脚本
```bash
# 进入后端目录
cd backend/pet-feeder-backend

# 执行SQL初始化脚本
mysql -u your_username -p your_database < database-init.sql
```

### 2. 验证初始化数据
初始化脚本会自动创建以下数据：

#### 权限数据（30个基础权限）
- 系统管理权限组
- 用户管理权限组
- 订单管理权限
- 设备管理权限
- 投诉处理权限

#### 角色数据（5个预设角色）
- **超级管理员**：拥有所有权限
- **系统管理员**：拥有大部分系统管理权限
- **订单管理员**：负责订单管理
- **设备管理员**：负责喂食器设备管理
- **客服专员**：负责投诉和客服工作

#### 菜单数据（19个菜单项）
包含完整的后台管理菜单结构：
- 系统管理（角色、权限、菜单、日志）
- 用户管理（管理员、普通用户）
- 订单管理（订单列表、统计）
- 设备管理（喂食器列表、状态）
- 投诉管理（投诉列表、统计）
- 数据统计
- 系统监控

#### 默认管理员账户
- **用户名**：admin
- **密码**：admin123
- **角色**：超级管理员

### 3. 权限配置检查

#### 权限代码配置
所有菜单项都已正确配置对应的`permission_code`字段：
- 系统管理菜单：`system:manage`
- 用户管理菜单：`user:manage`
- 订单管理菜单：`order:manage`
- 设备管理菜单：`feeder:manage`
- 投诉管理菜单：`complaint:handle`

#### 角色权限关联
- 超级管理员拥有所有权限和菜单
- 各角色按职责分配相应权限和菜单

## 🔧 开发注意事项

### 1. 实体类字段映射
在TypeORM实体类中，使用`name`属性指定数据库字段名：
```typescript
@Column({ type: 'int', default: 0, name: 'parent_id' })
parent_id: number;
```

### 2. 查询时注意事项
- 使用下划线命名的字段名
- 关联查询时注意表名前缀
- 时间字段统一使用`created_at`和`updated_at`

### 3. 新增表时规范
- 必须添加业务前缀
- 字段使用下划线命名法
- 包含标准时间字段
- 添加必要的索引和约束

## 📝 常见问题

### Q: 如何添加新的管理员权限？
A: 在`admin_permission`表中插入新权限，然后在`admin_role_permission`表中关联到相应角色。

### Q: 如何修改菜单结构？
A: 直接修改`admin_menu`表，注意`parent_id`的层级关系。

### Q: 如何重置管理员密码？
A: 使用bcryptjs加密新密码后更新`admin_user`表的`password`字段。

## 📚 相关文档
- [数据库初始化脚本](../backend/pet-feeder-backend/database-init.sql)
- [管理员系统架构](./admin-architecture.md)
- [API接口文档](./api-documentation.md)