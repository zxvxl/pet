-- 宠物喂食器管理系统 - 最小化数据库初始化脚本
-- 快速测试使用，仅包含必要的管理员用户和权限

-- 确保表存在（如果TypeORM已自动创建）
-- 管理员用户表
CREATE TABLE IF NOT EXISTS `admin_user` (
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

-- 管理员角色表
CREATE TABLE IF NOT EXISTS `admin_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE,
  `code` varchar(50) NOT NULL UNIQUE,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 管理员权限表
CREATE TABLE IF NOT EXISTS `admin_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(100) NOT NULL UNIQUE,
  `type` varchar(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 用户角色关联表
CREATE TABLE IF NOT EXISTS `admin_user_role` (
  `user_id` bigint NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `admin_user` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `admin_role` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 角色权限关联表
CREATE TABLE IF NOT EXISTS `admin_role_permission` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `admin_role` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `admin_permission` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 清理旧数据（谨慎使用）
DELETE FROM admin_user_role;
DELETE FROM admin_role_permission;
DELETE FROM admin_user;
DELETE FROM admin_role;
DELETE FROM admin_permission;

-- 插入核心权限
INSERT INTO `admin_permission` (`id`, `name`, `code`, `type`, `description`) VALUES
(1, '超级管理员权限', 'super:admin', 'group', '拥有所有权限'),
(2, '系统管理', 'system:manage', 'group', '系统管理'),
(3, '用户管理', 'user:manage', 'group', '用户管理'),
(4, '订单管理', 'order:manage', 'group', '订单管理'),
(5, '设备管理', 'feeder:manage', 'group', '喂食器设备管理'),
(6, '投诉管理', 'complaint:handle', 'group', '投诉处理'),
(7, '数据统计', 'dashboard:view', 'action', '查看数据统计'),
(8, '查看用户', 'user:view', 'action', '查看用户'),
(9, '查看订单', 'order:view', 'action', '查看订单'),
(10, '查看设备', 'feeder:view', 'action', '查看喂食器'),
(11, '查看投诉', 'complaint:view', 'action', '查看投诉');

-- 插入超级管理员角色
INSERT INTO `admin_role` (`id`, `name`, `code`, `description`) VALUES
(1, '超级管理员', 'super_admin', '拥有系统所有权限');

-- 插入管理员用户（密码：admin123）
INSERT INTO `admin_user` (`id`, `username`, `password`, `salt`, `nickname`, `email`, `phone`, `is_active`) VALUES
(1, 'admin', '$2b$10$8K1p/kVGKpDH0WJ8XP3Rhe6vTq9jB8mGKrXkJ8J3J3J3J3J3J3J3', '$2b$10$8K1p/kVGKpDH0WJ8XP3Rhe', '超级管理员', 'admin@petfeeder.com', '13800138000', 1);

-- 关联管理员与角色
INSERT INTO `admin_user_role` (`user_id`, `role_id`) VALUES (1, 1);

-- 关联角色与所有权限
INSERT INTO `admin_role_permission` (`role_id`, `permission_id`) 
SELECT 1, id FROM admin_permission;

-- 验证数据
SELECT '初始化完成！' AS message;
SELECT CONCAT('管理员账号：admin，密码：admin123') AS login_info;
SELECT CONCAT('权限数量：', (SELECT COUNT(*) FROM admin_permission)) AS permission_count;
SELECT CONCAT('角色数量：', (SELECT COUNT(*) FROM admin_role)) AS role_count;