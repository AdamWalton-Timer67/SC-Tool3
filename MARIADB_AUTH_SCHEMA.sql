CREATE TABLE IF NOT EXISTS auth_users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  approved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_sign_in_at TIMESTAMP NULL DEFAULT NULL,
  raw_user_meta_data LONGTEXT NULL
);

CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) PRIMARY KEY,
  display_name VARCHAR(120) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_roles (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  role VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_roles_user_id (user_id)
);

INSERT INTO auth_users (id, email, password, approved, created_at, raw_user_meta_data)
VALUES (
  'local-user-1',
  'local@test.lan',
  'admin123',
  1,
  NOW(),
  '{"role":"admin","display_name":"Local Tester"}'
)
ON DUPLICATE KEY UPDATE
  password = VALUES(password),
  approved = VALUES(approved),
  raw_user_meta_data = VALUES(raw_user_meta_data);

INSERT INTO profiles (id, display_name, created_at)
VALUES ('local-user-1', 'Local Tester', NOW())
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name);

INSERT INTO user_roles (id, user_id, role)
VALUES ('role_local_admin', 'local-user-1', 'admin')
ON DUPLICATE KEY UPDATE
  role = VALUES(role),
  user_id = VALUES(user_id);

SET @idx_exists := (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'auth_users'
    AND index_name = 'idx_auth_users_approved_created'
);
SET @create_idx_sql := IF(
  @idx_exists = 0,
  'CREATE INDEX idx_auth_users_approved_created ON auth_users (approved, created_at)',
  'SELECT 1'
);
PREPARE stmt FROM @create_idx_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
