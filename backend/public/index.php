<?php
// Simplified index.php based on working dragons_den pattern
$localAutoload = __DIR__ . '/../vendor/autoload.php';
$centralAutoload = __DIR__ . '/../../../vendor/autoload.php';

if (file_exists($centralAutoload)) {
    $loader = require $centralAutoload;
} elseif (file_exists($localAutoload)) {
    $loader = require $localAutoload;
} else {
    throw new RuntimeException('Composer autoload.php not found. Checked: ' . $centralAutoload . ' and ' . $localAutoload);
}

// Ensure autoloader points to the deployed API source directory
if (isset($loader) && method_exists($loader, 'addPsr4')) {
    $loader->addPsr4('AnimePromptGen\\', __DIR__ . '/../src/');
}

use DI\ContainerBuilder;
use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;
use AnimePromptGen\Core\Router;

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
$containerBuilder = new ContainerBuilder();
$containerBuilder->addDefinitions(__DIR__ . '/../config/dependencies.php');
$container = $containerBuilder->build();

// Router (rambler-style)
$router = new Router($container);

// Set base path for rewrite rules (uncommented for production deployment)
$router->setBasePath('/anime_prompt_gen');

// Handle CORS preflight
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, Accept, Origin, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    http_response_code(200);
    exit;
}

// Load the full routes file now that we have a working setup
(require __DIR__ . '/../config/routes.php')($router);

$router->handle();
