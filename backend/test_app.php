<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
require __DIR__ . '/config/database.php';

try {
    // Test dependency injection
    $containerBuilder = new \DI\ContainerBuilder();
    $containerBuilder->addDefinitions(__DIR__ . '/config/dependencies.php');
    $container = $containerBuilder->build();
    
    // Try to create the alien controller
    $alienController = $container->get(\AnimePromptGen\Controllers\AlienController::class);
    echo "✅ Alien controller created successfully\n";
    
    // Try to create the alien generation service
    $alienService = $container->get(\AnimePromptGen\Services\AlienGenerationService::class);
    echo "✅ Alien generation service created successfully\n";
    
    // Test basic generation
    $result = $alienService->generateAlienPromptData('Humanoid');
    echo "✅ Alien prompt generated: " . substr($result['description'], 0, 100) . "...\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}