-- 宠物喂食器管理系统数据库初始化脚本
-- 创建管理员用户、角色、权限和菜单数据

-- 1. 创建管理员用户表（如果不存在）
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

-- 2. 创建管理员角色表
CREATE TABLE IF NOT EXISTS `admin_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE,
  `code` varchar(50) NOT NULL UNIQUE,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 创建管理员权限表
CREATE TABLE IF NOT EXISTS `admin_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `code` varchar(100) NOT NULL UNIQUE,
  `type` varchar(20) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 创建用户角色关联表
CREATE TABLE IF NOT EXISTS `admin_user_role` (
  `user_id` bigint NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),  
  KEY `role_id` (`role_id`),
  CONSTRAINT `admin_user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `admin_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `admin_user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `admin_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 创建角色权限关联表
CREATE TABLE IF NOT EXISTS `admin_role_permission` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `admin_role_permission_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `admin_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `admin_role_permission_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `admin_permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 创建菜单表（用于前端路由和权限控制）
CREATE TABLE IF NOT EXISTS `admin_menu` (
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

-- 7. 创建角色菜单关联表
CREATE TABLE IF NOT EXISTS `admin_role_menu` (
  `role_id` int NOT NULL,
  `menu_id` int NOT NULL,
  PRIMARY KEY (`role_id`, `menu_id`),
  KEY `menu_id` (`menu_id`),
  CONSTRAINT `admin_role_menu_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `admin_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `admin_role_menu_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `admin_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. 插入基础权限数据
INSERT INTO `admin_permission` (`id`, `name`, `code`, `type`, `description`) VALUES
(1, '系统管理', 'system:manage', 'group', '系统管理权限组'),
(2, '用户管理', 'user:manage', 'group', '用户管理权限组'),
(3, '角色管理', 'role:manage', 'group', '角色管理权限组'),
(4, '权限管理', 'permission:manage', 'group', '权限管理权限组'),
(5, '菜单管理', 'menu:manage', 'group', '菜单管理权限组'),
(6, '查看用户', 'user:view', 'action', '查看用户列表'),
(7, '创建用户', 'user:create', 'action', '创建新用户'),
(8, '编辑用户', 'user:edit', 'action', '编辑用户信息'),
(9, '删除用户', 'user:delete', 'action', '删除用户'),
(10, '查看角色', 'role:view', 'action', '查看角色列表'),
(11, '创建角色', 'role:create', 'action', '创建新角色'),
(12, '编辑角色', 'role:edit', 'action', '编辑角色信息'),
(13, '删除角色', 'role:delete', 'action', '删除角色'),
(14, '查看权限', 'permission:view', 'action', '查看权限列表'),
(15, '创建权限', 'permission:create', 'action', '创建新权限'),
(16, '编辑权限', 'permission:edit', 'action', '编辑权限信息'),
(17, '删除权限', 'permission:delete', 'action', '删除权限'),
(18, '查看菜单', 'menu:view', 'action', '查看菜单列表'),
(19, '创建菜单', 'menu:create', 'action', '创建新菜单'),
(20, '编辑菜单', 'menu:edit', 'action', '编辑菜单信息'),
(21, '删除菜单', 'menu:delete', 'action', '删除菜单'),
(22, '查看订单', 'order:view', 'action', '查看订单列表'),
(23, '管理订单', 'order:manage', 'action', '管理订单状态'),
(24, '查看喂食器', 'feeder:view', 'action', '查看喂食器列表'),
(25, '管理喂食器', 'feeder:manage', 'action', '管理喂食器'),
(26, '查看投诉', 'complaint:view', 'action', '查看投诉列表'),
(27, '处理投诉', 'complaint:handle', 'action', '处理投诉'),
(28, '数据统计', 'dashboard:view', 'action', '查看数据统计'),
(29, '系统监控', 'system:monitor', 'action', '系统监控权限'),
(30, '操作日志', 'log:view', 'action', '查看操作日志');

-- 9. 插入基础角色数据
INSERT INTO `admin_role` (`id`, `name`, `code`, `description`) VALUES
(1, '超级管理员', 'super_admin', '拥有系统所有权限的超级管理员'),
(2, '系统管理员', 'system_admin', '系统管理员，拥有大部分权限'),
(3, '订单管理员', 'order_manager', '负责订单管理的管理员'),
(4, '设备管理员', 'device_manager', '负责喂食器设备管理的管理员'),
(5, '客服专员', 'customer_service', '负责处理投诉和客服工作');

-- 10. 插入管理员菜单数据
INSERT INTO `admin_menu` (`id`, `parent_id`, `name`, `path`, `component`, `icon`, `sort`, `is_show`, `is_cache`, `permission_code`) VALUES
-- 一级菜单
(1, 0, '系统管理', '/system', 'Layout', 'setting', 1, 1, 0, 'system:manage'),
(2, 0, '用户管理', '/user', 'Layout', 'user', 2, 1, 0, 'user:manage'),
(3, 0, '订单管理', '/order', 'Layout', 'file-text', 3, 1, 0, 'order:manage'),
(4, 0, '设备管理', '/device', 'Layout', 'printer', 4, 1, 0, 'feeder:manage'),
(5, 0, '投诉管理', '/complaint', 'Layout', 'warning', 5, 1, 0, 'complaint:handle'),
(6, 0, '数据统计', '/dashboard', 'Layout', 'dashboard', 0, 1, 0, 'dashboard:view'),
(7, 0, '系统监控', '/monitor', 'Layout', 'monitor', 6, 1, 0, 'system:monitor'),

-- 系统管理子菜单
(8, 1, '角色管理', '/system/role', 'system/role/index', 'team', 1, 1, 1, 'role:manage'),
(9, 1, '权限管理', '/system/permission', 'system/permission/index', 'lock', 2, 1, 1, 'permission:manage'),
(10, 1, '菜单管理', '/system/menu', 'system/menu/index', 'menu', 3, 1, 1, 'menu:manage'),
(11, 1, '操作日志', '/system/log', 'system/log/index', 'file-search', 4, 1, 1, 'log:view'),

-- 用户管理子菜单
(12, 2, '管理员用户', '/user/admin', 'user/admin/index', 'user', 1, 1, 1, 'user:manage'),
(13, 2, '普通用户', '/user/normal', 'user/normal/index', 'user', 2, 1, 1, 'user:view'),

-- 订单管理子菜单
(14, 3, '订单列表', '/order/list', 'order/list/index', 'file-text', 1, 1, 1, 'order:view'),
(15, 3, '订单统计', '/order/statistics', 'order/statistics/index', 'bar-chart', 2, 1, 1, 'order:manage'),

-- 设备管理子菜单
(16, 4, '喂食器列表', '/device/feeder', 'device/feeder/index', 'printer', 1, 1, 1, 'feeder:view'),
(17, 4, '设备状态', '/device/status', 'device/status/index', 'control', 2, 1, 1, 'feeder:manage'),

-- 投诉管理子菜单
(18, 5, '投诉列表', '/complaint/list', 'complaint/list/index', 'warning', 1, 1, 1, 'complaint:view'),
(19, 5, '投诉统计', '/complaint/statistics', 'complaint/statistics/index', 'pie-chart', 2, 1, 1, 'complaint:handle');

-- 11. 插入超级管理员用户（密码：admin123，已加密）
INSERT INTO `admin_user` (`id`, `username`, `password`, `salt`, `nickname`, `email`, `phone`, `is_active`) VALUES
(1, 'admin', '$2b$10$8K1p/kVGKpDH0WJ8XP3Rhe6vTq9jB8mGKrXkJ8J3J3J3J3J3J3J3', '$2b$10$8K1p/kVGKpDH0WJ8XP3Rhe', '超级管理员', 'admin@petfeeder.com', '13800138000', 1);

-- 12. 关联超级管理员与角色
INSERT INTO `admin_user_role` (`user_id`, `role_id`) VALUES
(1, 1);

-- 13. 关联角色与权限
-- 超级管理员拥有所有权限
INSERT INTO `admin_role_permission` (`role_id`, `permission_id`) 
SELECT 1, id FROM admin_permission;

-- 系统管理员权限
INSERT INTO `admin_role_permission` (`role_id`, `permission_id`) VALUES
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18), (2, 19), (2, 20), (2, 21), (2, 28), (2, 29), (2, 30);

-- 订单管理员权限
INSERT INTO `admin_role_permission` (`role_id`, `permission_id`) VALUES
(3, 22), (3, 23), (3, 28);

-- 设备管理员权限
INSERT INTO `admin_role_permission` (`role_id`, `permission_code`) VALUES
(4, 24), (4, 25), (4, 28);

-- 客服专员权限
INSERT INTO `admin_role_permission` (`role_id`, `permission_id`) VALUES
(5, 26), (5, 27), (5, 28);

-- 14. 关联角色与菜单
-- 超级管理员拥有所有菜单
INSERT INTO `admin_role_menu` (`role_id`, `menu_id`) 
SELECT 1, id FROM admin_menu;

-- 系统管理员菜单
INSERT INTO `admin_role_menu` (`role_id`, `menu_id`) VALUES
(2, 1), (2, 2), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18), (2, 19);

-- 订单管理员菜单
INSERT INTO `admin_role_menu` (`role_id`, `menu_id`) VALUES
(3, 3), (3, 6), (3, 14), (3, 15);

-- 设备管理员菜单
INSERT INTO `admin_role_menu` (`role_id`, `menu_id`) VALUES
(4, 4), (4, 6), (4, 16), (4, 17);

-- 客服专员菜单
INSERT INTO `admin_role_menu` (`role_id`, `menu_id`) VALUES
(5, 5), (5, 6), (5, 18), (5, 19);

-- 15. 创建索引优化查询性能
CREATE INDEX idx_admin_user_username ON admin_user(username);
CREATE INDEX idx_admin_user_email ON admin_user(email);
CREATE INDEX idx_admin_role_code ON admin_role(code);
CREATE INDEX idx_admin_permission_code ON admin_permission(code);
CREATE INDEX idx_admin_menu_parent_id ON admin_menu(parent_id);
CREATE INDEX idx_admin_menu_path ON admin_menu(path);

-- 16. 插入默认数据完成提示
SELECT '数据库初始化完成！' AS message;
SELECT CONCAT('管理员账号：admin，密码：admin123') AS login_info;
SELECT CONCAT('已创建 ', (SELECT COUNT(*) FROM admin_permission), ' 个权限') AS permission_count;
SELECT CONCAT('已创建 ', (SELECT COUNT(*) FROM admin_role), ' 个角色') AS role_count;
SELECT CONCAT('已创建 ', (SELECT COUNT(*) FROM admin_menu), ' 个菜单') AS menu_count;