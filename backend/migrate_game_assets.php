<?php
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database connection
require __DIR__ . '/config/database.php';

echo "Running game assets migration...\n";

try {
    $migration = require __DIR__ . '/database/migrations/009_create_game_assets_table.php';
    $migration->up();
    echo "✅ Game assets migration completed successfully!\n";
} catch (Exception $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
}
