<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
$capsule = require __DIR__ . '/config/database.php';

echo "Running database migrations...\n";

// Get all migration files
$migrationFiles = glob(__DIR__ . '/database/migrations/*.php');
sort($migrationFiles);

foreach ($migrationFiles as $file) {
    echo "Running migration: " . basename($file) . "\n";
    $migration = require $file;
    $migration->up();
    echo "✓ Completed migration: " . basename($file) . "\n";
}

echo "\nRunning database seeders...\n";

// Get all seeder files
$seederFiles = glob(__DIR__ . '/database/seeders/*.php');
sort($seederFiles);

foreach ($seederFiles as $file) {
    echo "Running seeder: " . basename($file) . "\n";
    $seeder = require $file;
    $seeder->run();
    echo "✓ Completed seeder: " . basename($file) . "\n";
}

echo "\n✅ Database setup completed successfully!\n";
