-- MySQL table creation scripts generated from TypeORM entities

-- feeder_service_orders table
CREATE TABLE feeder_service_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  feederId INT,
  orderId INT,
  signInLat DECIMAL(9,6) NULL,
  signInLng DECIMAL(9,6) NULL,
  signInTime DATETIME NULL,
  completeTime DATETIME NULL,
  completeImages JSON NULL,
  description TEXT NULL,
  status TINYINT DEFAULT 0,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_order (orderId),
  FOREIGN KEY (feederId) REFERENCES feeders(id),
  FOREIGN KEY (orderId) REFERENCES orders(id)
);

-- messages table
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('text', 'image', 'video', 'system') NOT NULL,
  senderId INT NOT NULL,
  receiverId INT NOT NULL,
  orderId INT NULL,
  payload JSON NOT NULL,
  timestamp BIGINT NOT NULL,
  status INT DEFAULT 0
);

-- emergency_calls table
CREATE TABLE emergency_calls (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  orderId INT NULL,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  phone VARCHAR(20) NULL
);

-- admin_user table
CREATE TABLE admin_user (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL,
  status TINYINT DEFAULT 1,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- feedback table
CREATE TABLE feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  userId INT NOT NULL,
  type JSON NOT NULL,
  description TEXT NOT NULL,
  images JSON NULL,
  contact VARCHAR(50) NULL,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- feeders table
CREATE TABLE feeders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  idCard VARCHAR(18) NOT NULL,
  avatar VARCHAR(255) NULL,
  status TINYINT DEFAULT 0,
  isBlacklist TINYINT DEFAULT 0,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  rating DECIMAL(3,2) DEFAULT 0,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- feeder_locations table
CREATE TABLE feeder_locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  lat DECIMAL(9,6) NOT NULL,
  lng DECIMAL(9,6) NOT NULL,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES feeder_service_orders(id)
);

-- evaluations table
CREATE TABLE evaluations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  userId INT NOT NULL,
  feederId INT NOT NULL,
  role ENUM('user', 'feeder') NOT NULL,
  star TINYINT NOT NULL,
  tags JSON NULL,
  content TEXT NULL,
  images JSON NULL,
  anonymous TINYINT DEFAULT 0,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (feederId) REFERENCES feeders(id)
);

-- admin_operation_log table
CREATE TABLE admin_operation_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  action VARCHAR(128) NOT NULL,
  targetId BIGINT NOT NULL,
  targetType VARCHAR(64) NOT NULL,
  detail TEXT NULL,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES admin_user(id)
);

-- pets table
CREATE TABLE pets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(50) NOT NULL,
  age INT NULL,
  notes TEXT NULL,
  feederId INT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (feederId) REFERENCES feeders(id)
);

-- complaints table
CREATE TABLE complaints (
  id INT PRIMARY KEY AUTO_INCREMENT,
  relatedOrderId INT NOT NULL,
  userId INT NOT NULL,
  complaintType VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  images JSON NULL,
  status VARCHAR(20) DEFAULT '待审核',
  handledById INT NULL,
  handledAt DATETIME NULL,
  result TEXT NULL,
  createTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relatedOrderId) REFERENCES orders(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (handledById) REFERENCES admin_user(id)
);

-- users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(100) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  phone VARCHAR(20) NULL
);

-- orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  petId INT NOT NULL,
  feederId INT NULL,
  startTime DATETIME NOT NULL,
  endTime DATETIME NOT NULL,
  status VARCHAR(50) NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (petId) REFERENCES pets(id),
  FOREIGN KEY (feederId) REFERENCES feeders(id)
);

-- service_types table
CREATE TABLE service_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  member_price DECIMAL(10,2) NOT NULL,
  description VARCHAR(255) NULL,
  supported_species VARCHAR(50) NULL,
  cover_url VARCHAR(255) NULL
);

-- reserve_orders table
CREATE TABLE reserve_orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  reserveTime DATETIME NOT NULL,
  address VARCHAR(200) NOT NULL,
  remark TEXT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- reserve_order_items table
CREATE TABLE reserve_order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  orderId INT NOT NULL,
  serviceId INT NOT NULL,
  petId INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  serviceName VARCHAR(50) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES reserve_orders(id),
  FOREIGN KEY (serviceId) REFERENCES service_types(id),
  FOREIGN KEY (petId) REFERENCES pets(id)
);