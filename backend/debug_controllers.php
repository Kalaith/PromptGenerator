<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use DI\ContainerBuilder;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
require __DIR__ . '/config/database.php';

echo "Testing controller instantiation...\n";

try {
    // Create DI Container
    $containerBuilder = new ContainerBuilder();
    $containerBuilder->addDefinitions(__DIR__ . '/config/dependencies.php');
    $container = $containerBuilder->build();
    
    echo "✅ Container built successfully\n";
    
    // Test each controller
    $controllers = [
        'PromptController' => \AnimePromptGen\Controllers\PromptController::class,
        'AdventurerController' => \AnimePromptGen\Controllers\AdventurerController::class,
        'AlienController' => \AnimePromptGen\Controllers\AlienController::class,
        'UserSessionController' => \AnimePromptGen\Controllers\UserSessionController::class,
        'SpeciesController' => \AnimePromptGen\Controllers\SpeciesController::class,
    ];
    
    foreach ($controllers as $name => $class) {
        try {
            $controller = $container->get($class);
            echo "✅ $name instantiated successfully\n";
        } catch (Exception $e) {
            echo "❌ $name failed: " . $e->getMessage() . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Container error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}