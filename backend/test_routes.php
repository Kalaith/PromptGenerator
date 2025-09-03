<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Psr7\Factory\ServerRequestFactory;
use DI\ContainerBuilder;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
require __DIR__ . '/config/database.php';

// Create DI Container
$containerBuilder = new ContainerBuilder();
$containerBuilder->addDefinitions(__DIR__ . '/config/dependencies.php');
$container = $containerBuilder->build();

// Create App without CORS middleware
AppFactory::setContainer($container);
$app = AppFactory::create();

// Add only essential middleware
$app->addBodyParsingMiddleware();
$app->addErrorMiddleware(true, true, true);

// Load routes
(require __DIR__ . '/config/routes.php')($app);

echo "Testing routes without CORS middleware:\n";

// Test health endpoint
$requestFactory = new ServerRequestFactory();

try {
    $request = $requestFactory->createServerRequest('GET', '/api/v1/health');
    $response = $app->handle($request);
    echo "Health endpoint status: " . $response->getStatusCode() . "\n";
    echo "Health endpoint body: " . $response->getBody() . "\n";
} catch (Exception $e) {
    echo "Health endpoint error: " . $e->getMessage() . "\n";
}

// Test a POST endpoint (prompt generation)
try {
    $request = $requestFactory->createServerRequest('POST', '/api/v1/prompts/generate');
    $request = $request->withHeader('Content-Type', 'application/json');
    $request = $request->withParsedBody(['count' => 1, 'type' => 'animalGirl']);
    
    $response = $app->handle($request);
    echo "Prompts endpoint status: " . $response->getStatusCode() . "\n";
    $body = (string)$response->getBody();
    $result = json_decode($body, true);
    if ($result && isset($result['image_prompts'])) {
        echo "Prompts endpoint worked! Generated " . count($result['image_prompts']) . " prompt(s)\n";
    } else {
        echo "Prompts endpoint body: " . substr($body, 0, 200) . "\n";
    }
} catch (Exception $e) {
    echo "Prompts endpoint error: " . $e->getMessage() . "\n";
}