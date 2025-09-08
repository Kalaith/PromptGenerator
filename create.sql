-- ====================================================================
-- Database: Anime Prompt Generator 
-- Formatted for phpMyAdmin with proper foreign key dependency order
-- Collation: utf8mb4_unicode_ci (standardized across all tables)
-- ====================================================================

-- Disable foreign key checks for clean import
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================================
-- INDEPENDENT TABLES (No foreign key dependencies)
-- ====================================================================

-- Users table - Must be created first as it's referenced by many other tables
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `egg_balance` int NOT NULL DEFAULT '500',
  `last_daily_reward` timestamp NULL DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `verification_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `auth0_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'local',
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_auth0_id_unique` (`auth0_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Game attributes table - Independent table with standardized collation
CREATE TABLE `game_attributes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'attribute',
  `description` text COLLATE utf8mb4_unicode_ci,
  `parent_category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weight` int NOT NULL DEFAULT '1',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_game_attributes_type` (`type`),
  KEY `idx_game_attributes_category` (`category`),
  KEY `idx_game_attributes_type_category` (`type`,`category`),
  KEY `idx_game_attributes_active` (`is_active`),
  KEY `idx_game_attributes_weight` (`weight`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects table - Independent table
CREATE TABLE `projects` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `stage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'prototype',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'prototype',
  `version` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0.1.0',
  `group_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'other',
  `repository_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `repository_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `show_on_homepage` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_group_name_hidden_index` (`group_name`,`hidden`),
  KEY `projects_status_index` (`status`),
  KEY `projects_stage_index` (`stage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project suggestions table - Independent table
CREATE TABLE `project_suggestions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `suggested_group` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Web Applications',
  `rationale` text COLLATE utf8mb4_unicode_ci,
  `votes` int NOT NULL DEFAULT '0',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Suggested',
  `submitted_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_suggestions_suggested_group_index` (`suggested_group`),
  KEY `project_suggestions_status_index` (`status`),
  KEY `project_suggestions_votes_index` (`votes`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity feed table - Independent table
CREATE TABLE `activity_feed` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `reference_id` bigint DEFAULT NULL,
  `reference_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_feed_type_index` (`type`),
  KEY `activity_feed_reference_type_reference_id_index` (`reference_type`,`reference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Votes table - Independent table
CREATE TABLE `votes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `voter_ip` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `voter_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `item_id` bigint NOT NULL,
  `item_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vote_value` tinyint NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_ip_vote` (`voter_ip`,`item_id`,`item_type`),
  UNIQUE KEY `unique_user_vote` (`voter_id`,`item_id`,`item_type`),
  KEY `votes_item_type_item_id_index` (`item_type`,`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- LEVEL 1 DEPENDENCIES (Reference users table only)
-- ====================================================================

-- Feature requests table - References users
CREATE TABLE `feature_requests` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL DEFAULT '1',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `use_case` text COLLATE utf8mb4_unicode_ci,
  `expected_benefits` text COLLATE utf8mb4_unicode_ci,
  `priority_level` enum('low','medium','high') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `feature_type` enum('enhancement','new_feature','bug_fix','ui_improvement','performance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'enhancement',
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Medium',
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Open',
  `approval_notes` text COLLATE utf8mb4_unicode_ci,
  `approved_by` int unsigned DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `total_eggs` int NOT NULL DEFAULT '0',
  `vote_count` int NOT NULL DEFAULT '0',
  `tags` json DEFAULT NULL,
  `votes` int NOT NULL DEFAULT '0',
  `project_id` bigint DEFAULT NULL,
  `submitted_by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feature_requests_status_index` (`status`),
  KEY `feature_requests_priority_index` (`priority`),
  KEY `feature_requests_category_index` (`category`),
  KEY `feature_requests_votes_index` (`votes`),
  KEY `feature_requests_project_id_index` (`project_id`),
  KEY `feature_requests_approved_by_foreign` (`approved_by`),
  CONSTRAINT `feature_requests_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Egg transactions table - References users
CREATE TABLE `egg_transactions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `amount` int NOT NULL,
  `transaction_type` enum('earn','spend','vote','daily_reward','registration_bonus','kofi_reward','admin_adjustment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_id` int DEFAULT NULL,
  `reference_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `egg_transactions_user_id_created_at_index` (`user_id`,`created_at`),
  CONSTRAINT `egg_transactions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email notifications table - References users
CREATE TABLE `email_notifications` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `metadata` json DEFAULT NULL,
  `status` enum('pending','sent','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  `error_message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email_notifications_user_id_foreign` (`user_id`),
  KEY `email_notifications_status_created_at_index` (`status`,`created_at`),
  CONSTRAINT `email_notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Feature votes table - References users
CREATE TABLE `feature_votes` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `feature_id` int unsigned NOT NULL,
  `eggs_allocated` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feature_votes_user_id_foreign` (`user_id`),
  CONSTRAINT `feature_votes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ko-fi integrations table - References users
CREATE TABLE `kofi_integrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned DEFAULT NULL,
  `kofi_transaction_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('donation','subscription') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_monthly` tinyint(1) NOT NULL DEFAULT '0',
  `eggs_awarded` int NOT NULL DEFAULT '0',
  `status` enum('pending','processed','failed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `raw_data` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kofi_integrations_kofi_transaction_id_unique` (`kofi_transaction_id`),
  KEY `kofi_integrations_user_id_foreign` (`user_id`),
  KEY `kofi_integrations_email_type_index` (`email`,`type`),
  CONSTRAINT `kofi_integrations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User preferences table - References users
CREATE TABLE `user_preferences` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `email_notifications_enabled` tinyint(1) NOT NULL DEFAULT '1',
  `daily_egg_reminders` tinyint(1) NOT NULL DEFAULT '1',
  `feature_approval_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `weekly_digest` tinyint(1) NOT NULL DEFAULT '1',
  `timezone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UTC',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_preferences_user_id_unique` (`user_id`),
  CONSTRAINT `user_preferences_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- LEVEL 2 DEPENDENCIES (Reference both users and feature_requests)
-- ====================================================================

-- Feature approvals table - References both users and feature_requests
CREATE TABLE `feature_approvals` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `feature_id` bigint unsigned NOT NULL,
  `admin_id` int unsigned NOT NULL,
  `action` enum('approve','reject','request_changes') COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `feature_approvals_feature_id_foreign` (`feature_id`),
  KEY `feature_approvals_admin_id_foreign` (`admin_id`),
  CONSTRAINT `feature_approvals_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `feature_approvals_feature_id_foreign` FOREIGN KEY (`feature_id`) REFERENCES `feature_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
