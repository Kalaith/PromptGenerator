-- ====================================================================
-- Database: Anime Prompt Generator (Create2)
-- Formatted for phpMyAdmin with proper foreign key dependency order
-- Collation: utf8mb4_unicode_ci (standardized across all tables)
-- ====================================================================

-- Disable foreign key checks for clean import
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================================
-- INDEPENDENT TABLES (No foreign key dependencies)
-- ====================================================================

-- Adventurer classes - Must be created before adventurers table
CREATE TABLE `adventurer_classes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `equipment_config` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `adventurer_classes_name_unique` (`name`),
  KEY `adventurer_classes_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Species table - Must be created before prompts table
CREATE TABLE `species` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `species_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ears` text COLLATE utf8mb4_unicode_ci,
  `tail` text COLLATE utf8mb4_unicode_ci,
  `wings` text COLLATE utf8mb4_unicode_ci,
  `features` json DEFAULT NULL,
  `personality` json DEFAULT NULL,
  `negative_prompt` text COLLATE utf8mb4_unicode_ci,
  `description_template` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `species_name_unique` (`name`),
  KEY `species_type_is_active_index` (`type`,`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Image generation queue - Must be created before generated_images table
CREATE TABLE `image_generation_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prompt_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `generator_type` enum('anime','alien','race','monster','monsterGirl','animalGirl') COLLATE utf8mb4_unicode_ci NOT NULL,
  `prompt_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `negative_prompt` text COLLATE utf8mb4_unicode_ci,
  `width` int DEFAULT '1024',
  `height` int DEFAULT '1024',
  `steps` int DEFAULT '20',
  `cfg_scale` decimal(3,1) DEFAULT '8.0',
  `seed` bigint DEFAULT '-1',
  `model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'juggernautXL_v8Rundiffusion.safetensors',
  `sampler` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'euler',
  `scheduler` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'normal',
  `priority` int DEFAULT '0',
  `requested_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `original_prompt_data` json DEFAULT NULL,
  `status` enum('pending','processing','completed','failed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `attempts` int DEFAULT '0',
  `max_attempts` int DEFAULT '3',
  `processing_started_at` timestamp NULL DEFAULT NULL,
  `processing_completed_at` timestamp NULL DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prompt_id` (`prompt_id`),
  KEY `idx_status_priority` (`status`,`priority` DESC),
  KEY `idx_generator_type` (`generator_type`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Alien species table - Independent table
CREATE TABLE `alien_species` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `form` text COLLATE utf8mb4_unicode_ci,
  `variations` json DEFAULT NULL,
  `features` json DEFAULT NULL,
  `visual_descriptors` json DEFAULT NULL,
  `key_traits` json DEFAULT NULL,
  `ai_prompt_elements` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alien_species_class_index` (`class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Alien traits table - Independent table
CREATE TABLE `alien_traits` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('positive','negative') COLLATE utf8mb4_unicode_ci NOT NULL,
  `effect` text COLLATE utf8mb4_unicode_ci,
  `visual_descriptors` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alien_traits_type_index` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attribute config table - Independent table with standardized collation
CREATE TABLE `attribute_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `generator_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `input_type` enum('select','multi-select','text','number','checkbox') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'select',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_generator_category` (`generator_type`,`category`),
  KEY `idx_generator_active` (`generator_type`,`is_active`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Attributes table - Independent table
CREATE TABLE `attributes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `weight` int NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'attribute',
  `description` text COLLATE utf8mb4_unicode_ci,
  `parent_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `attributes_category_is_active_index` (`category`,`is_active`),
  KEY `attributes_weight_index` (`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Description templates table - Independent table
CREATE TABLE `description_templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `generator_type` enum('adventurer','alien','anime','base') COLLATE utf8mb4_unicode_ci NOT NULL,
  `template` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `description_templates_name_generator_type_unique` (`name`,`generator_type`),
  KEY `description_templates_generator_type_index` (`generator_type`),
  KEY `description_templates_is_active_index` (`is_active`),
  KEY `description_templates_is_default_index` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Game assets table - Independent table
CREATE TABLE `game_assets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `metadata` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `game_assets_type_is_active_index` (`type`,`is_active`),
  KEY `game_assets_type_index` (`type`),
  KEY `game_assets_is_active_index` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Image generation stats table - Independent table with standardized collation
CREATE TABLE `image_generation_stats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_recorded` date NOT NULL,
  `generator_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_queued` int DEFAULT '0',
  `total_completed` int DEFAULT '0',
  `total_failed` int DEFAULT '0',
  `total_cancelled` int DEFAULT '0',
  `avg_processing_time_seconds` int DEFAULT '0',
  `min_processing_time_seconds` int DEFAULT '0',
  `max_processing_time_seconds` int DEFAULT '0',
  `total_file_size_mb` decimal(10,2) DEFAULT '0.00',
  `avg_file_size_mb` decimal(8,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_date_type` (`date_recorded`,`generator_type`),
  KEY `idx_date` (`date_recorded` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Templates table - Independent table
CREATE TABLE `templates` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `type` enum('anime','alien') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'anime',
  `template_data` json NOT NULL,
  `is_public` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_by` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `usage_count` int NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `templates_type_index` (`type`),
  KEY `templates_is_public_index` (`is_public`),
  KEY `templates_is_active_index` (`is_active`),
  KEY `templates_created_by_index` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Unified species table - Independent table with standardized collation
CREATE TABLE `unified_species` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'standard',
  `description` text COLLATE utf8mb4_unicode_ci,
  `ears` text COLLATE utf8mb4_unicode_ci,
  `tail` text COLLATE utf8mb4_unicode_ci,
  `wings` text COLLATE utf8mb4_unicode_ci,
  `features` json DEFAULT NULL,
  `personality` json DEFAULT NULL,
  `key_traits` json DEFAULT NULL,
  `visual_descriptors` json DEFAULT NULL,
  `physical_features` json DEFAULT NULL,
  `negative_prompt` text COLLATE utf8mb4_unicode_ci,
  `ai_prompt_elements` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `weight` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_species_name_type` (`name`,`type`),
  KEY `idx_unified_species_type` (`type`),
  KEY `idx_unified_species_category` (`type`,`category`),
  KEY `idx_unified_species_active` (`is_active`),
  KEY `idx_unified_species_weight` (`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions table - Independent table
CREATE TABLE `user_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `favorites` json DEFAULT NULL,
  `history` json DEFAULT NULL,
  `preferences` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_sessions_session_id_unique` (`session_id`),
  KEY `user_sessions_session_id_index` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- LEVEL 1 DEPENDENCIES (Reference only independent tables)
-- ====================================================================

-- Adventurers table - References adventurer_classes
CREATE TABLE `adventurers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `race` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_id` bigint unsigned NOT NULL,
  `experience_level` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `race_traits` json DEFAULT NULL,
  `generated_equipment` json DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `adventurers_class_id_foreign` (`class_id`),
  KEY `adventurers_race_index` (`race`),
  KEY `adventurers_experience_level_index` (`experience_level`),
  CONSTRAINT `adventurers_class_id_foreign` FOREIGN KEY (`class_id`) REFERENCES `adventurer_classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Prompts table - References species
CREATE TABLE `prompts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `negative_prompt` text COLLATE utf8mb4_unicode_ci,
  `tags` json DEFAULT NULL,
  `species_id` bigint unsigned DEFAULT NULL,
  `prompt_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `generated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `prompts_species_id_foreign` (`species_id`),
  KEY `prompts_prompt_type_index` (`prompt_type`),
  KEY `prompts_generated_at_index` (`generated_at`),
  CONSTRAINT `prompts_species_id_foreign` FOREIGN KEY (`species_id`) REFERENCES `species` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Generated images table - References image_generation_queue
CREATE TABLE `generated_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `queue_id` int DEFAULT NULL,
  `prompt_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_filename` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size_bytes` bigint DEFAULT NULL,
  `ftp_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gallery_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gallery_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thumbnail_path` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `width` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `format` enum('png','jpg','webp') COLLATE utf8mb4_unicode_ci DEFAULT 'png',
  `generation_params` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_public` tinyint(1) DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0',
  `view_count` int DEFAULT '0',
  `download_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_filename_gallery` (`filename`,`gallery_type`),
  KEY `queue_id` (`queue_id`),
  KEY `idx_gallery_type` (`gallery_type`),
  KEY `idx_prompt_id` (`prompt_id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_is_public` (`is_public`),
  KEY `idx_created_at` (`created_at` DESC),
  KEY `idx_view_count` (`view_count` DESC),
  CONSTRAINT `generated_images_ibfk_1` FOREIGN KEY (`queue_id`) REFERENCES `image_generation_queue` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- LEVEL 2 DEPENDENCIES (Reference both independent and level 1 tables)
-- ====================================================================

-- Image collections table - References generated_images
CREATE TABLE `image_collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `generator_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) DEFAULT '1',
  `is_featured` tinyint(1) DEFAULT '0',
  `cover_image_id` int DEFAULT NULL,
  `created_by_session` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cover_image_id` (`cover_image_id`),
  KEY `idx_generator_type` (`generator_type`),
  KEY `idx_is_public` (`is_public`),
  KEY `idx_created_at` (`created_at` DESC),
  KEY `idx_session` (`created_by_session`),
  CONSTRAINT `image_collections_ibfk_1` FOREIGN KEY (`cover_image_id`) REFERENCES `generated_images` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- LEVEL 3 DEPENDENCIES (Reference collections and images)
-- ====================================================================

-- Collection images table - References both image_collections and generated_images
CREATE TABLE `collection_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `collection_id` int NOT NULL,
  `image_id` int NOT NULL,
  `sort_order` int DEFAULT '0',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_collection_image` (`collection_id`,`image_id`),
  KEY `image_id` (`image_id`),
  KEY `idx_sort_order` (`collection_id`,`sort_order`),
  CONSTRAINT `collection_images_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `image_collections` (`id`) ON DELETE CASCADE,
  CONSTRAINT `collection_images_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `generated_images` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;