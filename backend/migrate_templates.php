<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
$capsule = require __DIR__ . '/config/database.php';

echo "Running templates migration...\n";

try {
    $migration = require __DIR__ . '/database/migrations/007_create_templates_table.php';
    $migration->up();
    echo "✅ Templates table created successfully!\n";
} catch (Exception $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
}