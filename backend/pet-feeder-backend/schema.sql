-- 宠物喂食器管理系统数据库统一命名规范脚本
-- 按照技术方案要求统一表名、字段命名规范
-- 命名规范：
-- 1. 表名：小写+下划线+模块前缀
-- 2. 字段名：小写下划线
-- 3. 通用字段：id, create_time, update_time, is_deleted

-- 1. 用户模块表
CREATE TABLE IF NOT EXISTS `user_account` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `open_id` varchar(100) NOT NULL UNIQUE COMMENT '微信openid',
  `union_id` varchar(100) DEFAULT NULL UNIQUE COMMENT '微信unionid',
  `nickname` varchar(100) NOT NULL COMMENT '用户昵称',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `role` varchar(20) DEFAULT 'user' COMMENT '用户角色：user/operator/super',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户账户表';

-- 2. 宠物模块表
CREATE TABLE IF NOT EXISTS `user_pet` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `name` varchar(100) NOT NULL COMMENT '宠物名称',
  `species` varchar(50) NOT NULL COMMENT '品种',
  `age` int DEFAULT NULL COMMENT '年龄',
  `notes` text COMMENT '备注',
  `feeder_id` bigint DEFAULT NULL COMMENT '当前喂养员ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `feeder_id` (`feeder_id`),
  CONSTRAINT `user_pet_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_pet_feeder_fk` FOREIGN KEY (`feeder_id`) REFERENCES `feeder_info` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户宠物表';

-- 3. 喂养员模块表
CREATE TABLE IF NOT EXISTS `feeder_info` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '关联用户ID',
  `name` varchar(100) NOT NULL COMMENT '姓名',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `id_card` varchar(18) NOT NULL COMMENT '身份证号',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `status` tinyint(1) DEFAULT 0 COMMENT '状态：0-待审核,1-通过,2-拒绝',
  `reject_reason` varchar(255) DEFAULT NULL COMMENT '拒绝原因',
  `is_blacklist` tinyint(1) DEFAULT 0 COMMENT '是否黑名单',
  `rating` decimal(3,2) DEFAULT 0.00 COMMENT '评分',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `feeder_info_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='喂养员信息表';

-- 4. 订单模块表
CREATE TABLE IF NOT EXISTS `user_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `pet_id` bigint NOT NULL COMMENT '宠物ID',
  `feeder_id` bigint DEFAULT NULL COMMENT '喂养员ID',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `status` varchar(50) DEFAULT 'pending' COMMENT '订单状态',
  `total_price` decimal(10,2) DEFAULT 0.00 COMMENT '总价',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `pet_id` (`pet_id`),
  KEY `feeder_id` (`feeder_id`),
  CONSTRAINT `user_order_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_order_pet_fk` FOREIGN KEY (`pet_id`) REFERENCES `user_pet` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_order_feeder_fk` FOREIGN KEY (`feeder_id`) REFERENCES `feeder_info` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户订单表';

-- 5. 投诉模块表
CREATE TABLE IF NOT EXISTS `review_complaint` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL COMMENT '关联订单ID',
  `user_id` bigint NOT NULL COMMENT '投诉用户ID',
  `complaint_type` varchar(50) NOT NULL COMMENT '投诉类型',
  `description` text NOT NULL COMMENT '投诉描述',
  `images` json DEFAULT NULL COMMENT '图片证据',
  `status` varchar(20) DEFAULT '待审核' COMMENT '处理状态',
  `handled_by` bigint DEFAULT NULL COMMENT '处理人ID',
  `handled_at` datetime DEFAULT NULL COMMENT '处理时间',
  `result` text COMMENT '处理结果',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `handled_by` (`handled_by`),
  CONSTRAINT `review_complaint_order_fk` FOREIGN KEY (`order_id`) REFERENCES `user_order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_complaint_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_complaint_handler_fk` FOREIGN KEY (`handled_by`) REFERENCES `admin_user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户投诉表';

-- 6. 反馈模块表
CREATE TABLE IF NOT EXISTS `review_feedback` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL COMMENT '关联订单ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `type` json NOT NULL COMMENT '反馈类型',
  `description` text NOT NULL COMMENT '反馈描述',
  `images` json DEFAULT NULL COMMENT '图片',
  `contact` varchar(50) DEFAULT NULL COMMENT '联系方式',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `review_feedback_order_fk` FOREIGN KEY (`order_id`) REFERENCES `user_order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_feedback_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户反馈表';

-- 7. 服务订单模块表
CREATE TABLE IF NOT EXISTS `service_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `service_type_id` bigint NOT NULL COMMENT '服务类型ID',
  `pet_id` bigint DEFAULT NULL COMMENT '宠物ID',
  `feeder_id` bigint DEFAULT NULL COMMENT '喂养员ID',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `status` varchar(50) DEFAULT 'pending' COMMENT '订单状态',
  `price` decimal(10,2) DEFAULT 0.00 COMMENT '服务价格',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `service_type_id` (`service_type_id`),
  KEY `pet_id` (`pet_id`),
  KEY `feeder_id` (`feeder_id`),
  CONSTRAINT `service_order_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `service_order_service_type_fk` FOREIGN KEY (`service_type_id`) REFERENCES `service_type` (`id`) ON DELETE CASCADE,
  CONSTRAINT `service_order_pet_fk` FOREIGN KEY (`pet_id`) REFERENCES `user_pet` (`id`) ON DELETE SET NULL,
  CONSTRAINT `service_order_feeder_fk` FOREIGN KEY (`feeder_id`) REFERENCES `feeder_info` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务订单表';

-- 8. 服务类型表
CREATE TABLE IF NOT EXISTS `service_type` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '服务名称',
  `description` text COMMENT '服务描述',
  `price` decimal(10,2) NOT NULL COMMENT '服务价格',
  `duration` int DEFAULT NULL COMMENT '服务时长（分钟）',
  `status` tinyint(1) DEFAULT 1 COMMENT '状态：1-启用,0-禁用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务类型表';

-- 9. 预约订单模块表
CREATE TABLE IF NOT EXISTS `reserve_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `pet_id` bigint NOT NULL COMMENT '宠物ID',
  `feeder_id` bigint DEFAULT NULL COMMENT '喂养员ID',
  `reserve_time` datetime NOT NULL COMMENT '预约时间',
  `status` varchar(50) DEFAULT 'pending' COMMENT '预约状态',
  `notes` text COMMENT '备注',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `pet_id` (`pet_id`),
  KEY `feeder_id` (`feeder_id`),
  CONSTRAINT `reserve_order_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reserve_order_pet_fk` FOREIGN KEY (`pet_id`) REFERENCES `user_pet` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reserve_order_feeder_fk` FOREIGN KEY (`feeder_id`) REFERENCES `feeder_info` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预约订单表';

-- 10. 服务追踪模块表
CREATE TABLE IF NOT EXISTS `track_path` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL COMMENT '订单ID',
  `feeder_id` bigint NOT NULL COMMENT '喂养员ID',
  `latitude` decimal(10,8) NOT NULL COMMENT '纬度',
  `longitude` decimal(11,8) NOT NULL COMMENT '经度',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `feeder_id` (`feeder_id`),
  CONSTRAINT `track_path_order_fk` FOREIGN KEY (`order_id`) REFERENCES `user_order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `track_path_feeder_fk` FOREIGN KEY (`feeder_id`) REFERENCES `feeder_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='服务轨迹表';

-- 11. 评价模块表
CREATE TABLE IF NOT EXISTS `review_evaluation` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL COMMENT '订单ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `feeder_id` bigint NOT NULL COMMENT '喂养员ID',
  `rating` tinyint(1) NOT NULL COMMENT '评分1-5',
  `content` text COMMENT '评价内容',
  `images` json DEFAULT NULL COMMENT '评价图片',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  KEY `feeder_id` (`feeder_id`),
  CONSTRAINT `review_evaluation_order_fk` FOREIGN KEY (`order_id`) REFERENCES `user_order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_evaluation_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_evaluation_feeder_fk` FOREIGN KEY (`feeder_id`) REFERENCES `feeder_info` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评价表';