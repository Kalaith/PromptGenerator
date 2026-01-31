<?php

declare(strict_types=1);

require_once __DIR__ . '/vendor/autoload.php';

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        list($name, $value) = explode('=', $line, 2);
        $_ENV[$name] = $value;
        putenv("$name=$value");
    }
}

// Bootstrap database connection
$capsule = require_once __DIR__ . '/config/database.php';

try {
    // Create generator_types table if it doesn't exist
    $pdo = $capsule->connection()->getPdo();

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `generator_types` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(50) NOT NULL,
            `display_name` varchar(100) NOT NULL,
            `description` text,
            `endpoint` varchar(100) DEFAULT NULL,
            `route_key` varchar(50) DEFAULT NULL,
            `is_active` tinyint(1) NOT NULL DEFAULT 1,
            `sort_order` int(11) NOT NULL DEFAULT 0,
            `created_at` timestamp NULL DEFAULT NULL,
            `updated_at` timestamp NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `name` (`name`),
            KEY `is_active` (`is_active`),
            KEY `sort_order` (`sort_order`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Insert default generator types
    $generatorTypes = [
        [
            'name' => 'anime',
            'display_name' => 'Anime Character',
            'description' => 'Generate anime-style characters including kemonomimi and monster girls',
            'endpoint' => '/api/v1/anime/generate',
            'route_key' => 'anime',
            'is_active' => 1,
            'sort_order' => 1,
        ],
        [
            'name' => 'alien',
            'display_name' => 'Alien Character',
            'description' => 'Generate alien characters from various worlds and climates',
            'endpoint' => '/api/v1/aliens/generate',
            'route_key' => 'alien',
            'is_active' => 1,
            'sort_order' => 2,
        ],
        [
            'name' => 'adventurer',
            'display_name' => 'Fantasy Adventurer',
            'description' => 'Generate fantasy RPG characters with classes and races',
            'endpoint' => '/api/v1/adventurers/generate',
            'route_key' => 'adventurer',
            'is_active' => 1,
            'sort_order' => 3,
        ],
        [
            'name' => 'kemonomimi',
            'display_name' => 'Kemonomimi',
            'description' => 'Generate characters with animal ears and features',
            'endpoint' => '/api/v1/anime/generate',
            'route_key' => 'kemonomimi',
            'is_active' => 1,
            'sort_order' => 4,
        ],
        [
            'name' => 'monster-girl',
            'display_name' => 'Monster Girl',
            'description' => 'Generate monster girl characters',
            'endpoint' => '/api/v1/anime/generate',
            'route_key' => 'monster-girl',
            'is_active' => 1,
            'sort_order' => 5,
        ],
        [
            'name' => 'monster',
            'display_name' => 'Monster',
            'description' => 'Generate monster characters',
            'endpoint' => '/api/v1/anime/generate',
            'route_key' => 'monster',
            'is_active' => 1,
            'sort_order' => 6,
        ],
    ];

    $stmt = $pdo->prepare("
        INSERT IGNORE INTO `generator_types` 
        (`name`, `display_name`, `description`, `endpoint`, `route_key`, `is_active`, `sort_order`, `created_at`, `updated_at`) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");

    foreach ($generatorTypes as $type) {
        $stmt->execute([
            $type['name'],
            $type['display_name'],
            $type['description'],
            $type['endpoint'],
            $type['route_key'],
            $type['is_active'],
            $type['sort_order'],
        ]);
    }

    echo "Generator types table created and populated successfully!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}