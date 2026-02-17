CREATE TABLE IF NOT EXISTS auth_users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  approved TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_sign_in_at TIMESTAMP NULL DEFAULT NULL,
  raw_user_meta_data LONGTEXT NULL
);

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
