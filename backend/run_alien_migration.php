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
    $sql = file_get_contents(__DIR__ . '/database/migrations/populate_alien_attributes.sql');
    $capsule->connection()->getPdo()->exec($sql);
    echo "Alien attributes populated successfully!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}