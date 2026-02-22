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


-- Datamined Wikelo 4.6 seed (initial import from provided JSON)
INSERT INTO rewards (id, name_en, name_fr, type_en, type_fr, category, rarity, version, favor_cost, description_en, description_fr, image_url, image_credit, mission_name_en, mission_name_fr, has_loadout, gives, not_released)
VALUES
  ('reward_dm_item_001', 'Ana Arms Endro; Ana Legs Endro; Ana Core Endro; Ana Helmet Endro', 'Ana Arms Endro; Ana Legs Endro; Ana Core Endro; Ana Helmet Endro', 'Armor', 'Armor', 'utilities', 'epic', '4.6', NULL, 'Hello, know many humans want saldynium for regen problem. Credits good, yes, but Wikelo can use that, kopion horn, and other things to make special armor. Once done, you be very tough. Very scary. You see items needed. Bring to and I make for you. Bye.', 'Hello, know many humans want saldynium for regen problem. Credits good, yes, but Wikelo can use that, kopion horn, and other things to make special armor. Once done, you be very tough. Very scary. You see items needed. Bring to and I make for you. Bye.', '/images/armour_endro.jpg', NULL, 'Armor with horn and string', 'Armor with horn and string', 0, 1, 0),
  ('reward_dm_item_002', 'Parallax', 'Parallax', 'Weapon', 'Weapon', 'weapons', 'epic', '4.6', NULL, 'Hello. Can make fun change to gun if you want. Use kopion skin for pattern and little skull dangle. Very effective. Shoot much better. All you need is bring me parts to and will make. Bye.', 'Hello. Can make fun change to gun if you want. Use kopion skin for pattern and little skull dangle. Very effective. Shoot much better. All you need is bring me parts to and will make. Bye.', '/images/gun_kopion_military.jpg', NULL, 'Fun Kopion Skull Gun', 'Fun Kopion Skull Gun', 0, 1, 0),
  ('reward_dm_item_012', 'Bokto Core; Bokto Arms; Bokto Legs; Bokto Helmet', 'Bokto Core; Bokto Arms; Bokto Legs; Bokto Helmet', 'Armor', 'Armor', 'utilities', 'epic', '4.6', NULL, 'Wikelo had exciting idea during brief work rest. Was thinking about the little glow worms in Pyro and saw armor get changed to look like. If you get me parts, bring to and will make for you then you can glow too. Bye.', 'Wikelo had exciting idea during brief work rest. Was thinking about the little glow worms in Pyro and saw armor get changed to look like. If you get me parts, bring to and will make for you then you can glow too. Bye.', '/images/armour_endro_glow.jpg', NULL, 'Make glowy armor', 'Make glowy armor', 0, 1, 0),
  ('reward_dm_ship_001', 'MISC Fortune Wikelo Special', 'MISC Fortune Wikelo Special', 'Ship', 'Ship', 'ships', 'epic', '4.6', NULL, '', '', NULL, NULL, 'Fortune ship for you', 'Fortune ship for you', 1, 1, 0),
  ('reward_dm_ship_002', 'Aopoa Nox Wikelo Special', 'Aopoa Nox Wikelo Special', 'Ship', 'Ship', 'ships', 'epic', '4.6', NULL, '', '', NULL, NULL, 'Noxy Mod', 'Noxy Mod', 1, 1, 0),
  ('reward_dm_intro_item_032', 'Wikelo Arrive to System', 'Wikelo Arrive to System', 'Intro', 'Intro', 'utilities', 'common', '4.6', NULL, 'Hello, I am Wikelo. Recent addition to your system and very excited to be here. Spent many time here in UEE and happy to spent more. Have place where I make things from other things. Need person to bring me useful things to finish project I work on. You have list. Get, please. I am at . Will give you item for your help. Also, when done, if you want to do more. Have many things can make in my humble shop. Come, look at pretty poster and then decide what you want me to make. Bye.', 'Hello, I am Wikelo. Recent addition to your system and very excited to be here. Spent many time here in UEE and happy to spent more. Have place where I make things from other things. Need person to bring me useful things to finish project I work on. You have list. Get, please. I am at . Will give you item for your help. Also, when done, if you want to do more. Have many things can make in my humble shop. Come, look at pretty poster and then decide what you want me to make. Bye.', NULL, NULL, 'Wikelo Arrive to System', 'Wikelo Arrive to System', 0, 1, 0),
  ('reward_dm_currency_worm_parts', 'Wikelo Favor', 'Wikelo Favor', 'Currency', 'Currency', 'utilities', 'common', '4.6', NULL, 'Have new way to get favors from Wikelo. Hear much about worm things in radiation storms. Made up of many interesting parts that Wikelo find use for. If you bring parts to , will trade for favor. Bye.', 'Have new way to get favors from Wikelo. Hear much about worm things in radiation storms. Made up of many interesting parts that Wikelo find use for. If you bring parts to , will trade for favor. Bye.', NULL, NULL, 'Trade Worm Parts for Favors?', 'Trade Worm Parts for Favors?', 0, 1, 0)
ON DUPLICATE KEY UPDATE
  name_en = VALUES(name_en),
  name_fr = VALUES(name_fr),
  type_en = VALUES(type_en),
  type_fr = VALUES(type_fr),
  category = VALUES(category),
  rarity = VALUES(rarity),
  version = VALUES(version),
  description_en = VALUES(description_en),
  description_fr = VALUES(description_fr),
  image_url = VALUES(image_url),
  mission_name_en = VALUES(mission_name_en),
  mission_name_fr = VALUES(mission_name_fr),
  has_loadout = VALUES(has_loadout),
  gives = VALUES(gives),
  not_released = VALUES(not_released);

INSERT INTO ingredients (id, name_en, name_fr, category, rarity, image_url, description_en, description_fr, how_to_obtain_en, how_to_obtain_fr, location_id)
VALUES
  ('ing_dm_carinite_pure', 'Carinite (Pure)', 'Carinite (Pure)', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_antium_core', 'Antium Core', 'Antium Core', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_antium_helmet', 'Antium Helmet', 'Antium Helmet', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_antium_legs', 'Antium Legs', 'Antium Legs', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_antium_arms', 'Antium Arms', 'Antium Arms', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_carinite', 'Carinite', 'Carinite', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_saldynium_ore', 'Saldynium (Ore)', 'Saldynium (Ore)', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_parallax_energy_assault_rifle', 'Parallax Energy Assault Rifle', 'Parallax Energy Assault Rifle', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_tundra_kopion_horn', 'Tundra Kopion Horn', 'Tundra Kopion Horn', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_jaclium_ore', 'Jaclium (Ore)', 'Jaclium (Ore)', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_irradiated_valakkar_pearl_grade_aaa', 'Irradiated Valakkar Pearl (Grade AAA)', 'Irradiated Valakkar Pearl (Grade AAA)', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_wikelo_favor', 'Wikelo Favor', 'Wikelo Favor', 'currency', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_vestal_water', 'Vestal Water', 'Vestal Water', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL),
  ('ing_dm_irradiated_valakkar_pearl_grade_aa', 'Irradiated Valakkar Pearl (Grade AA)', 'Irradiated Valakkar Pearl (Grade AA)', 'special', 'common', NULL, NULL, NULL, NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE
  name_en = VALUES(name_en),
  name_fr = VALUES(name_fr),
  category = VALUES(category),
  rarity = VALUES(rarity);

INSERT INTO reward_ingredients (id, reward_id, ingredient_id, quantity, unit)
VALUES
  ('ri_dm_item_001_1', 'reward_dm_item_001', 'ing_dm_carinite_pure', 1, 'x'),
  ('ri_dm_item_001_2', 'reward_dm_item_001', 'ing_dm_antium_core', 1, 'x'),
  ('ri_dm_item_001_3', 'reward_dm_item_001', 'ing_dm_antium_helmet', 1, 'x'),
  ('ri_dm_item_001_4', 'reward_dm_item_001', 'ing_dm_antium_legs', 1, 'x'),
  ('ri_dm_item_001_5', 'reward_dm_item_001', 'ing_dm_antium_arms', 1, 'x'),
  ('ri_dm_item_002_1', 'reward_dm_item_002', 'ing_dm_carinite', 10, 'x'),
  ('ri_dm_item_002_2', 'reward_dm_item_002', 'ing_dm_saldynium_ore', 15, 'x'),
  ('ri_dm_item_002_3', 'reward_dm_item_002', 'ing_dm_parallax_energy_assault_rifle', 1, 'x'),
  ('ri_dm_item_002_4', 'reward_dm_item_002', 'ing_dm_tundra_kopion_horn', 20, 'x'),
  ('ri_dm_item_002_5', 'reward_dm_item_002', 'ing_dm_jaclium_ore', 20, 'x'),
  ('ri_dm_item_012_1', 'reward_dm_item_012', 'ing_dm_antium_core', 1, 'x'),
  ('ri_dm_item_012_2', 'reward_dm_item_012', 'ing_dm_antium_helmet', 1, 'x'),
  ('ri_dm_item_012_3', 'reward_dm_item_012', 'ing_dm_antium_arms', 1, 'x'),
  ('ri_dm_item_012_4', 'reward_dm_item_012', 'ing_dm_antium_legs', 1, 'x'),
  ('ri_dm_item_012_5', 'reward_dm_item_012', 'ing_dm_irradiated_valakkar_pearl_grade_aaa', 1, 'x'),
  ('ri_dm_ship_001_1', 'reward_dm_ship_001', 'ing_dm_wikelo_favor', 3, 'x'),
  ('ri_dm_ship_001_2', 'reward_dm_ship_001', 'ing_dm_carinite_pure', 1, 'x'),
  ('ri_dm_ship_002_1', 'reward_dm_ship_002', 'ing_dm_wikelo_favor', 4, 'x'),
  ('ri_dm_intro_1', 'reward_dm_intro_item_032', 'ing_dm_vestal_water', 1, 'x'),
  ('ri_dm_intro_2', 'reward_dm_intro_item_032', 'ing_dm_tundra_kopion_horn', 3, 'x'),
  ('ri_dm_exchange_1', 'reward_dm_currency_worm_parts', 'ing_dm_irradiated_valakkar_pearl_grade_aa', 12, 'x')
ON DUPLICATE KEY UPDATE
  reward_id = VALUES(reward_id),
  ingredient_id = VALUES(ingredient_id),
  quantity = VALUES(quantity),
  unit = VALUES(unit);

INSERT INTO reputation_requirements (id, reward_id, reputation_name_en, reputation_name_fr, required_level)
VALUES
  ('rep_dm_item_001', 'reward_dm_item_001', 'Wikelo Reputation', 'Réputation Wikelo', 0),
  ('rep_dm_item_002', 'reward_dm_item_002', 'Wikelo Reputation', 'Réputation Wikelo', 0),
  ('rep_dm_item_012', 'reward_dm_item_012', 'Wikelo Reputation', 'Réputation Wikelo', 0),
  ('rep_dm_ship_001', 'reward_dm_ship_001', 'Wikelo Reputation', 'Réputation Wikelo', 0),
  ('rep_dm_ship_002', 'reward_dm_ship_002', 'Wikelo Reputation', 'Réputation Wikelo', 0)
ON DUPLICATE KEY UPDATE
  reward_id = VALUES(reward_id),
  reputation_name_en = VALUES(reputation_name_en),
  reputation_name_fr = VALUES(reputation_name_fr),
  required_level = VALUES(required_level);
