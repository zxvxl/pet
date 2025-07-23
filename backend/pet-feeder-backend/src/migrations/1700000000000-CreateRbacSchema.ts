import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRbacSchema1700000000000 implements MigrationInterface {
  name = 'CreateRbacSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255) NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description VARCHAR(255) NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE admin_user_roles (
        admin_user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (admin_user_id, role_id),
        FOREIGN KEY (admin_user_id) REFERENCES admin_user(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      INSERT INTO roles (name, description) VALUES
        ('super', 'Super Administrator'),
        ('operator', 'Operator'),
        ('user', 'Regular user'),
        ('feeder', 'Feeder')
    `);
    await queryRunner.query(`
      INSERT INTO permissions (name, description) VALUES
        ('admin:access', 'Access admin APIs'),
        ('order:manage', 'Manage orders'),
        ('feeder:approve', 'Approve feeders')
    `);
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.name = 'super'
    `);
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT (SELECT id FROM roles WHERE name = 'operator'), p.id
      FROM permissions p WHERE p.name IN ('order:manage','feeder:approve')
    `);
    await queryRunner.query(`
      INSERT INTO user_roles (user_id, role_id)
      SELECT id, (SELECT id FROM roles WHERE name = role) FROM users
    `);
    await queryRunner.query(`
      INSERT INTO admin_user_roles (admin_user_id, role_id)
      SELECT id, (SELECT id FROM roles WHERE name = role) FROM admin_user
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE admin_user_roles');
    await queryRunner.query('DROP TABLE user_roles');
    await queryRunner.query('DROP TABLE role_permissions');
    await queryRunner.query('DROP TABLE permissions');
    await queryRunner.query('DROP TABLE roles');
  }
}
