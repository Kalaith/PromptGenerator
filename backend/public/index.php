<?php
// Simplified index.php based on working dragons_den pattern
require __DIR__ . '/../vendor/autoload.php';

use Slim\Factory\AppFactory;
use DI\Container;
use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Initialize database connection (direct like dragons_den)
$capsule = new Capsule;
$capsule->addConnection([
    'driver'    => 'mysql',
    'host'      => $_ENV['DB_HOST'] ?? 'localhost',
    'database'  => $_ENV['DB_DATABASE'] ?? 'prompt_gen',
    'username'  => $_ENV['DB_USERNAME'] ?? 'root',
    'password'  => $_ENV['DB_PASSWORD'] ?? '',
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix'    => '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

// Simple container (like dragons_den)
$container = new Container();
AppFactory::setContainer($container);
$app = AppFactory::create();

// CORS Middleware - Simple headers only for actual requests
$app->add(function ($request, $handler) {
    $response = $handler->handle($request);
    return $response
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
});

// Set base path for rewrite rules (comment out for development)
// $app->setBasePath('/anime_prompt_gen');

// Other Middleware
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();

// Error Middleware
$errorMiddleware = $app->addErrorMiddleware(true, true, true);

// Load the full routes file now that we have a working setup
(require __DIR__ . '/../config/routes.php')($app);

$app->run();