-- Core application schema + initial seed data from legacy mock DB
-- Safe to run multiple times (idempotent inserts/updates).

CREATE TABLE IF NOT EXISTS locations (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name_en VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  system VARCHAR(64) NOT NULL,
  planet VARCHAR(128) NULL,
  moon VARCHAR(128) NULL,
  type VARCHAR(64) NOT NULL,
  difficulty VARCHAR(64) NULL,
  short_description_en TEXT NULL,
  short_description_fr TEXT NULL,
  description_en TEXT NULL,
  description_fr TEXT NULL,
  how_to_access_en TEXT NULL,
  how_to_access_fr TEXT NULL,
  mission_types_en TEXT NULL,
  mission_types_fr TEXT NULL,
  loot_types_en TEXT NULL,
  loot_types_fr TEXT NULL,
  requirements TEXT NULL,
  rewards TEXT NULL,
  coordinates VARCHAR(255) NULL,
  crate_types LONGTEXT NULL,
  related_missions LONGTEXT NULL,
  image_url VARCHAR(1024) NULL,
  cheatsheet_image_url VARCHAR(1024) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rewards (
  id VARCHAR(64) PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  type_en VARCHAR(255) NULL,
  type_fr VARCHAR(255) NULL,
  category VARCHAR(128) NOT NULL,
  rarity VARCHAR(64) NOT NULL,
  version VARCHAR(64) NULL,
  favor_cost INT NULL,
  description_en TEXT NULL,
  description_fr TEXT NULL,
  image_url VARCHAR(1024) NULL,
  image_credit VARCHAR(255) NULL,
  mission_name_en VARCHAR(255) NULL,
  mission_name_fr VARCHAR(255) NULL,
  has_loadout TINYINT(1) NOT NULL DEFAULT 0,
  gives INT NOT NULL DEFAULT 1,
  not_released TINYINT(1) NOT NULL DEFAULT 0,
  components LONGTEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rewards_name_en (name_en),
  INDEX idx_rewards_category (category)
);

CREATE TABLE IF NOT EXISTS ingredients (
  id VARCHAR(64) PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  rarity VARCHAR(64) NOT NULL,
  image_url VARCHAR(1024) NULL,
  image_credit VARCHAR(255) NULL,
  description_en TEXT NULL,
  description_fr TEXT NULL,
  how_to_obtain_en TEXT NULL,
  how_to_obtain_fr TEXT NULL,
  locations_en LONGTEXT NULL,
  locations_fr LONGTEXT NULL,
  location_id VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ingredients_name_en (name_en),
  INDEX idx_ingredients_location_id (location_id)
);

CREATE TABLE IF NOT EXISTS reward_ingredients (
  id VARCHAR(64) PRIMARY KEY,
  reward_id VARCHAR(64) NOT NULL,
  ingredient_id VARCHAR(64) NOT NULL,
  quantity INT NOT NULL,
  unit VARCHAR(32) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_reward_ingredient (reward_id, ingredient_id),
  INDEX idx_reward_ingredients_reward_id (reward_id),
  INDEX idx_reward_ingredients_ingredient_id (ingredient_id)
);

CREATE TABLE IF NOT EXISTS reputation_requirements (
  id VARCHAR(64) PRIMARY KEY,
  reward_id VARCHAR(64) NOT NULL,
  reputation_name_en VARCHAR(255) NULL,
  reputation_name_fr VARCHAR(255) NULL,
  required_level INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reputation_requirements_reward_id (reward_id)
);

CREATE TABLE IF NOT EXISTS suggestions (
  id VARCHAR(64) PRIMARY KEY,
  item_type VARCHAR(64) NOT NULL,
  item_id VARCHAR(128) NULL,
  item_name VARCHAR(255) NULL,
  suggestion_type VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  user_email VARCHAR(255) NULL,
  user_id VARCHAR(64) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organizations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  image_url VARCHAR(1024) NULL,
  owner_id CHAR(36) NOT NULL,
  is_public TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS organization_members (
  id VARCHAR(64) PRIMARY KEY,
  organization_id VARCHAR(64) NOT NULL,
  user_id CHAR(36) NOT NULL,
  role VARCHAR(32) NOT NULL,
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_org_user (organization_id, user_id),
  INDEX idx_organization_members_org (organization_id),
  INDEX idx_organization_members_user (user_id)
);

CREATE TABLE IF NOT EXISTS organization_join_requests (
  id VARCHAR(64) PRIMARY KEY,
  organization_id VARCHAR(64) NOT NULL,
  user_id CHAR(36) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  message TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_join_requests_org (organization_id),
  INDEX idx_join_requests_user (user_id)
);

CREATE TABLE IF NOT EXISTS user_inventory (
  id VARCHAR(64) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  ingredient_id VARCHAR(64) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_inventory (user_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS user_reward_ingredients (
  id VARCHAR(64) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  reward_id VARCHAR(64) NOT NULL,
  ingredient_id VARCHAR(64) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_reward_ingredient (user_id, reward_id, ingredient_id)
);

CREATE TABLE IF NOT EXISTS user_reward_completions (
  id VARCHAR(64) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  reward_id VARCHAR(64) NOT NULL,
  completion_count INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_reward_completion (user_id, reward_id)
);

CREATE TABLE IF NOT EXISTS user_favorite_rewards (
  id VARCHAR(64) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  reward_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_favorite_reward (user_id, reward_id)
);

CREATE TABLE IF NOT EXISTS user_favorite_ingredients (
  id VARCHAR(64) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  ingredient_id VARCHAR(64) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_user_favorite_ingredient (user_id, ingredient_id)
);

-- Seed data copied from the historical mock DB baseline used in local mode.
INSERT INTO locations (id, slug, name_en, name_fr, system, type, difficulty, description_en, description_fr, image_url)
VALUES
  ('loc_pyro_station', 'pyro-gateway-station', 'Pyro Gateway Station', 'Station Passerelle Pyro', 'pyro', 'station', 'medium', 'A contested station often used as a trading waypoint.', 'Une station contestée souvent utilisée comme point de commerce.', '/images/locations/pyro-gateway-station.jpg'),
  ('loc_bloom_outpost', 'bloom-mining-outpost', 'Bloom Mining Outpost', 'Avant-poste Minier Bloom', 'pyro', 'outpost', 'hard', 'Remote outpost with dense hostiles and high-value loot.', 'Avant-poste reculé avec de nombreux hostiles et du butin de valeur.', '/images/locations/bloom-mining-outpost.jpg')
ON DUPLICATE KEY UPDATE
  slug = VALUES(slug),
  name_en = VALUES(name_en),
  name_fr = VALUES(name_fr),
  system = VALUES(system),
  type = VALUES(type),
  difficulty = VALUES(difficulty),
  description_en = VALUES(description_en),
  description_fr = VALUES(description_fr),
  image_url = VALUES(image_url);

INSERT INTO rewards (id, name_en, name_fr, type_en, type_fr, category, rarity, version, favor_cost, description_en, description_fr, image_url, has_loadout, gives, not_released)
VALUES
  ('reward_karna', 'Karna Plasma Rifle', 'Fusil Plasma Karna', 'Weapon', 'Arme', 'weapons', 'epic', '4.0', 120, 'Reliable plasma rifle for medium range combat.', 'Fusil plasma fiable pour le combat à moyenne portée.', '/images/wikelo/karna.webp', 0, 1, 0),
  ('reward_polaris', 'Polaris', 'Polaris', 'Ship', 'Vaisseau', 'ships', 'legendary', '4.0', 500, 'Capital patrol corvette reward.', 'Récompense de corvette de patrouille capitale.', '/images/wikelo/polaris.jpeg', 1, 1, 0)
ON DUPLICATE KEY UPDATE
  name_en = VALUES(name_en),
  name_fr = VALUES(name_fr),
  type_en = VALUES(type_en),
  type_fr = VALUES(type_fr),
  category = VALUES(category),
  rarity = VALUES(rarity),
  version = VALUES(version),
  favor_cost = VALUES(favor_cost),
  description_en = VALUES(description_en),
  description_fr = VALUES(description_fr),
  image_url = VALUES(image_url),
  has_loadout = VALUES(has_loadout),
  gives = VALUES(gives),
  not_released = VALUES(not_released);

INSERT INTO ingredients (id, name_en, name_fr, category, rarity, image_url, description_en, description_fr, how_to_obtain_en, how_to_obtain_fr, location_id)
VALUES
  ('ing_jaclium', 'Jaclium', 'Jaclium', 'mineral', 'rare', '/images/wikelo/jaclium.webp', 'A volatile mineral used in advanced crafting.', 'Un minerai volatil utilisé dans l’artisanat avancé.', 'Mine in Pyro asteroid fields.', 'Miner dans les champs d’astéroïdes de Pyro.', 'loc_pyro_station'),
  ('ing_valakkar_fang', 'Irradiated Valakkar Fang', 'Croc de Valakkar Irradié', 'creature', 'epic', '/images/wikelo/irradiated_valakkar_fang_adult.png', 'Rare trophy from dangerous fauna.', 'Trophée rare provenant d’une faune dangereuse.', 'Loot from irradiated Valakkar encounters.', 'Butin d’affrontements avec des Valakkars irradiés.', 'loc_bloom_outpost')
ON DUPLICATE KEY UPDATE
  name_en = VALUES(name_en),
  name_fr = VALUES(name_fr),
  category = VALUES(category),
  rarity = VALUES(rarity),
  image_url = VALUES(image_url),
  description_en = VALUES(description_en),
  description_fr = VALUES(description_fr),
  how_to_obtain_en = VALUES(how_to_obtain_en),
  how_to_obtain_fr = VALUES(how_to_obtain_fr),
  location_id = VALUES(location_id);

INSERT INTO reward_ingredients (id, reward_id, ingredient_id, quantity, unit)
VALUES
  ('ri_1', 'reward_karna', 'ing_jaclium', 4, 'x'),
  ('ri_2', 'reward_polaris', 'ing_jaclium', 20, 'x'),
  ('ri_3', 'reward_polaris', 'ing_valakkar_fang', 5, 'x')
ON DUPLICATE KEY UPDATE
  reward_id = VALUES(reward_id),
  ingredient_id = VALUES(ingredient_id),
  quantity = VALUES(quantity),
  unit = VALUES(unit);

INSERT INTO reputation_requirements (id, reward_id, reputation_name_en, reputation_name_fr, required_level)
VALUES
  ('rep_req_1', 'reward_polaris', 'Council Standing', 'Réputation du Conseil', 3)
ON DUPLICATE KEY UPDATE
  reward_id = VALUES(reward_id),
  reputation_name_en = VALUES(reputation_name_en),
  reputation_name_fr = VALUES(reputation_name_fr),
  required_level = VALUES(required_level);

INSERT INTO suggestions (id, item_type, item_id, item_name, suggestion_type, content, user_email, user_id)
VALUES
  ('sug_1', 'ingredient', 'ing_jaclium', 'Jaclium', 'location_update', 'Spawns more frequently around Pyro Gate in 4.0.1.', 'tester@example.com', NULL)
ON DUPLICATE KEY UPDATE
  item_type = VALUES(item_type),
  item_id = VALUES(item_id),
  item_name = VALUES(item_name),
  suggestion_type = VALUES(suggestion_type),
  content = VALUES(content),
  user_email = VALUES(user_email),
  user_id = VALUES(user_id);

INSERT INTO organizations (id, name, slug, description, image_url, owner_id, is_public)
VALUES
  ('org_stanton_scouts', 'Stanton Scouts', 'stanton-scouts', 'Casual org for exploration and community missions.', NULL, 'local-user-1', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  slug = VALUES(slug),
  description = VALUES(description),
  image_url = VALUES(image_url),
  owner_id = VALUES(owner_id),
  is_public = VALUES(is_public);

INSERT INTO organization_members (id, organization_id, user_id, role)
VALUES
  ('org_mem_1', 'org_stanton_scouts', 'local-user-1', 'owner')
ON DUPLICATE KEY UPDATE
  organization_id = VALUES(organization_id),
  user_id = VALUES(user_id),
  role = VALUES(role);
