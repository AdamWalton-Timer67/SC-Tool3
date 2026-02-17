CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  approved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL DEFAULT NULL
);

SET @idx_exists := (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND index_name = 'idx_users_approved_created'
);
SET @create_idx_sql := IF(
  @idx_exists = 0,
  'CREATE INDEX idx_users_approved_created ON users (approved, created_at)',
  'SELECT 1'
);
PREPARE stmt FROM @create_idx_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
