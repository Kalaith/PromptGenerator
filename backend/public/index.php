<?php

declare(strict_types=1);

$autoloadCandidates = [];
$searchDir = __DIR__;
for ($i = 0; $i < 8; $i++) {
    $autoloadCandidates[] = $searchDir . '/vendor/autoload.php';
    $parent = dirname($searchDir);
    if ($parent === $searchDir) {
        break;
    }
    $searchDir = $parent;
}

$autoloadCandidates[] = __DIR__ . '/../vendor/autoload.php';
$autoloadCandidates[] = __DIR__ . '/../../vendor/autoload.php';
$autoloadCandidates[] = __DIR__ . '/../../../vendor/autoload.php';
$autoloadCandidates[] = __DIR__ . '/../../../../vendor/autoload.php';
$autoloadCandidates[] = 'H:/WebHatchery/vendor/autoload.php';

$loader = null;
foreach (array_unique($autoloadCandidates) as $candidate) {
    if (file_exists($candidate)) {
        $loader = require $candidate;
        break;
    }
}

if ($loader === null) {
    throw new RuntimeException('Composer autoload.php not found for anime_prompt_gen backend.');
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

$requiredEnv = static function (string $name): string {
    $value = $_ENV[$name] ?? $_SERVER[$name] ?? getenv($name);
    if (!is_string($value) || trim($value) === '') {
        throw new RuntimeException("Missing required environment variable: {$name}");
    }

    return $value;
};

foreach (['JWT_SECRET', 'JWT_EXPIRATION', 'WEBHATCHERY_LOGIN_URL'] as $requiredEnvName) {
    $requiredEnv($requiredEnvName);
}

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
