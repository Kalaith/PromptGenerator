<?php

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
require __DIR__ . '/config/database.php';

try {
    $result = Capsule::select('SHOW TABLES');
    echo "Existing tables:\n";
    foreach ($result as $row) {
        $tableName = array_values((array)$row)[0];
        echo "- " . $tableName . "\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
}