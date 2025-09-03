<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
$capsule = require __DIR__ . '/config/database.php';

echo "Running alien-specific migrations...\n";

// Only run alien migrations
$alienMigrations = [
    '006_create_alien_species_table.php',
    '007_create_alien_traits_table.php'
];

foreach ($alienMigrations as $migrationFile) {
    $filePath = __DIR__ . '/database/migrations/' . $migrationFile;
    if (file_exists($filePath)) {
        echo "Running migration: " . $migrationFile . "\n";
        $migration = require $filePath;
        $migration->up();
        echo "✓ Completed migration: " . $migrationFile . "\n";
    }
}

echo "\nRunning alien-specific seeders...\n";

// Only run alien seeders
$alienSeeders = [
    'AlienSpeciesSeeder.php',
    'AlienTraitSeeder.php'
];

foreach ($alienSeeders as $seederFile) {
    $filePath = __DIR__ . '/database/seeders/' . $seederFile;
    if (file_exists($filePath)) {
        echo "Running seeder: " . $seederFile . "\n";
        $seeder = require $filePath;
        $seeder->run();
        echo "✓ Completed seeder: " . $seederFile . "\n";
    }
}

echo "\n✅ Alien database setup completed successfully!\n";