<?php

declare(strict_types=1);

$autoloadCandidates = [
    __DIR__ . '/../../../vendor/autoload.php',
    __DIR__ . '/vendor/autoload.php',
];
$autoloader = null;
foreach ($autoloadCandidates as $candidate) {
    if (file_exists($candidate)) {
        $autoloader = $candidate;
        break;
    }
}
if (!$autoloader) {
    throw new RuntimeException("Composer autoload.php not found for anime_prompt_gen migration script.");
}
$loader = require $autoloader;
if (is_object($loader) && method_exists($loader, 'addPsr4')) {
    $loader->addPsr4('AnimePromptGen\\', __DIR__ . '/src/');
}

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
