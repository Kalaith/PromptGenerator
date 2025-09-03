<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
$capsule = require __DIR__ . '/config/database.php';

echo "Running user session migration...\n";

$migrationFile = '008_create_user_sessions_table.php';
$filePath = __DIR__ . '/database/migrations/' . $migrationFile;

if (file_exists($filePath)) {
    echo "Running migration: " . $migrationFile . "\n";
    $migration = require $filePath;
    $migration->up();
    echo "✓ Completed migration: " . $migrationFile . "\n";
}

echo "\n✅ User session migration completed successfully!\n";