<?php
declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database connection
require __DIR__ . '/config/database.php';

echo "Running description templates migration...\n";

try {
    $migration = require __DIR__ . '/database/migrations/008_create_description_templates_table.php';
    $migration->up();
    echo "✅ Description templates migration completed successfully!\n";
} catch (Exception $e) {
    echo "❌ Migration failed: " . $e->getMessage() . "\n";
}
