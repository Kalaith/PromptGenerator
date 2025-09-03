<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Slim\Factory\AppFactory;
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

// Create App
AppFactory::setContainer($container);
$app = AppFactory::create();

echo "Testing route loading...\n";

// Load routes
$routeLoader = require __DIR__ . '/config/routes.php';
echo "✅ Route loader function loaded\n";

$routeLoader($app);
echo "✅ Routes loaded into app\n";

// Get all routes
$routeCollector = $app->getRouteCollector();
$routes = $routeCollector->getRoutes();

echo "📋 Loaded routes (" . count($routes) . "):\n";
foreach ($routes as $route) {
    $methods = implode(',', $route->getMethods());
    $pattern = $route->getPattern();
    echo "  $methods $pattern\n";
}

// Test a simple route addition
$app->get('/test', function ($request, $response) {
    $response->getBody()->write('test');
    return $response;
});

$routes = $routeCollector->getRoutes();
echo "📋 After adding test route (" . count($routes) . "):\n";
foreach ($routes as $route) {
    $methods = implode(',', $route->getMethods());
    $pattern = $route->getPattern();
    echo "  $methods $pattern\n";
}