<?php

declare(strict_types=1);

use AnimePromptGen\Core\Router;
use AnimePromptGen\Controllers\PromptController;
use AnimePromptGen\Controllers\AdventurerController;
use AnimePromptGen\Controllers\AlienController;
use AnimePromptGen\Controllers\UserSessionController;
use AnimePromptGen\Controllers\SpeciesController;
use AnimePromptGen\Controllers\TemplateController;
use AnimePromptGen\Controllers\DescriptionTemplateController;
use AnimePromptGen\Controllers\GameAssetsController;
use AnimePromptGen\Controllers\AnimeAttributesController;
use AnimePromptGen\Controllers\GeneratorAttributesController;
use AnimePromptGen\Controllers\AttributeConfigController;
use AnimePromptGen\Controllers\AttributeCategoryController;
use AnimePromptGen\Controllers\GeneratorTypesController;
use AnimePromptGen\Controllers\ImageController;
use AnimePromptGen\Controllers\ImageQueueController;
use AnimePromptGen\Controllers\AuthController;
use AnimePromptGen\Middleware\JwtMiddleware;

return function (Router $router): void {
    $api = '/api/v1';

    // Prompt generation routes
    $router->post($api . '/prompts/generate', [PromptController::class, 'generate']);

    // Adventurer generation routes
    $router->post($api . '/adventurers/generate', [AdventurerController::class, 'generate']);
    $router->post($api . '/adventurers/generate-multiple', [AdventurerController::class, 'generateMultiple']);
    $router->get($api . '/adventurers/options', [AdventurerController::class, 'getAvailableOptions']);

    // Alien generation routes
    $router->post($api . '/aliens/generate', [AlienController::class, 'generate']);
    $router->get($api . '/aliens/species-classes', [AlienController::class, 'getSpeciesClasses']);
    $router->get($api . '/aliens/genders', [AlienController::class, 'getGenders']);
    $router->get($api . '/aliens/artistic-styles', [AlienController::class, 'getArtisticStyles']);
    $router->get($api . '/aliens/environments', [AlienController::class, 'getEnvironments']);
    $router->get($api . '/aliens/climates', [AlienController::class, 'getClimates']);

    // User session routes (for favorites, history, preferences) - Legacy support
    $router->get($api . '/session', [UserSessionController::class, 'getSession']);
    $router->post($api . '/session/favorites/add', [UserSessionController::class, 'addToFavorites']);
    $router->post($api . '/session/favorites/remove', [UserSessionController::class, 'removeFromFavorites']);
    $router->post($api . '/session/history/add', [UserSessionController::class, 'addToHistory']);
    $router->post($api . '/session/history/clear', [UserSessionController::class, 'clearHistory']);
    $router->post($api . '/session/preferences', [UserSessionController::class, 'updatePreferences']);

    // Auth routes (central login system)
    $router->post($api . '/auth/register', [AuthController::class, 'register']);
    $router->post($api . '/auth/login', [AuthController::class, 'login']);

    // Species routes
    $router->get($api . '/species', [SpeciesController::class, 'getAll']);
    $router->get($api . '/species/types', [SpeciesController::class, 'getTypes']);

    // Generator types routes
    $router->get($api . '/generator-types', [GeneratorTypesController::class, 'getAll']);
    $router->get($api . '/generator-types/names', [GeneratorTypesController::class, 'getNames']);
    $router->post($api . '/generator-types', [GeneratorTypesController::class, 'create'], [JwtMiddleware::class]);
    $router->put($api . '/generator-types/{id}', [GeneratorTypesController::class, 'update'], [JwtMiddleware::class]);
    $router->delete($api . '/generator-types/{id}', [GeneratorTypesController::class, 'delete'], [JwtMiddleware::class]);

    // Generic attributes route (replaces specific routes)
    $router->get($api . '/attributes/{type}', [GeneratorAttributesController::class, 'getAttributes']);
    $router->get($api . '/generator-attributes/{type}', [GeneratorAttributesController::class, 'getAttributes']);

    // Legacy anime attributes route (for backward compatibility)
    $router->get($api . '/anime/attributes', [AnimeAttributesController::class, 'getAttributes']);

    // Attribute configuration management
    $router->get($api . '/attribute-config', [AttributeConfigController::class, 'getConfigs'], [JwtMiddleware::class]);
    $router->post($api . '/attribute-config', [AttributeConfigController::class, 'createConfig'], [JwtMiddleware::class]);
    $router->put($api . '/attribute-config/{id}', [AttributeConfigController::class, 'updateConfig'], [JwtMiddleware::class]);
    $router->delete($api . '/attribute-config/{id}', [AttributeConfigController::class, 'deleteConfig'], [JwtMiddleware::class]);

    // Attribute category management (generator-agnostic)
    $router->get($api . '/attribute-categories', [AttributeCategoryController::class, 'getCategories'], [JwtMiddleware::class]);
    $router->get($api . '/attribute-categories/{category}/options', [AttributeCategoryController::class, 'getCategoryOptions'], [JwtMiddleware::class]);
    $router->post($api . '/attribute-categories/{category}/options', [AttributeCategoryController::class, 'createCategoryOption'], [JwtMiddleware::class]);
    $router->put($api . '/attribute-options/{id}', [AttributeCategoryController::class, 'updateOption'], [JwtMiddleware::class]);
    $router->delete($api . '/attribute-options/{id}', [AttributeCategoryController::class, 'deleteOption'], [JwtMiddleware::class]);

    // Template routes (specific routes must come before parameterized routes)
    $router->get($api . '/templates', [TemplateController::class, 'getAll']);
    $router->get($api . '/templates/popular', [TemplateController::class, 'getPopular']);
    $router->get($api . '/templates/recent', [TemplateController::class, 'getRecent']);
    $router->get($api . '/templates/search', [TemplateController::class, 'search']);
    $router->post($api . '/templates', [TemplateController::class, 'create'], [JwtMiddleware::class]);
    $router->get($api . '/templates/{id}', [TemplateController::class, 'getById']);
    $router->put($api . '/templates/{id}', [TemplateController::class, 'update'], [JwtMiddleware::class]);
    $router->delete($api . '/templates/{id}', [TemplateController::class, 'delete'], [JwtMiddleware::class]);
    $router->post($api . '/templates/{id}/use', [TemplateController::class, 'incrementUsage']);
    $router->post($api . '/templates/{id}/clone', [TemplateController::class, 'clone'], [JwtMiddleware::class]);

    // Description template routes (specific routes must come before parameterized routes)
    $router->get($api . '/description-templates', [DescriptionTemplateController::class, 'getTemplates']);
    $router->get($api . '/description-templates/generator-types', [DescriptionTemplateController::class, 'getGeneratorTypes']);
    $router->post($api . '/description-templates/bulk/{generator_type}', [DescriptionTemplateController::class, 'bulkUpdateTemplates'], [JwtMiddleware::class]);
    $router->post($api . '/description-templates', [DescriptionTemplateController::class, 'createTemplate'], [JwtMiddleware::class]);
    $router->get($api . '/description-templates/{id}', [DescriptionTemplateController::class, 'getTemplate']);
    $router->put($api . '/description-templates/{id}', [DescriptionTemplateController::class, 'updateTemplate'], [JwtMiddleware::class]);
    $router->delete($api . '/description-templates/{id}', [DescriptionTemplateController::class, 'deleteTemplate'], [JwtMiddleware::class]);

    // Game assets routes (specific routes must come before parameterized routes)
    $router->get($api . '/game-assets/types', [GameAssetsController::class, 'getAssetTypes']);
    $router->post($api . '/game-assets/initialize', [GameAssetsController::class, 'initializeAssets'], [JwtMiddleware::class]);
    $router->get($api . '/game-assets/{type}', [GameAssetsController::class, 'getAssetsByType']);
    $router->get($api . '/game-assets/{type}/categories', [GameAssetsController::class, 'getCategoriesByType']);

    // Image generation and management routes (specific routes MUST come before variable routes)
    $router->post($api . '/images/generate', [ImageQueueController::class, 'queueGeneration']);
    $router->get($api . '/images/queue', [ImageQueueController::class, 'getQueue']);
    $router->get($api . '/images/queue/status', [ImageQueueController::class, 'getQueueStatus']);
    $router->put($api . '/images/queue/{id}/status', [ImageQueueController::class, 'updateStatus'], [JwtMiddleware::class]);
    $router->delete($api . '/images/queue/{id}', [ImageQueueController::class, 'cancelGeneration'], [JwtMiddleware::class]);

    $router->get($api . '/images/stats', [ImageController::class, 'getGalleryStats']);
    $router->get($api . '/images', [ImageController::class, 'getImages']);
    $router->get($api . '/images/{id}', [ImageController::class, 'getImage']);
    $router->get($api . '/images/{id}/download', [ImageController::class, 'downloadImage']);
    $router->post($api . '/images/{queue_id}/complete', [ImageController::class, 'completeGeneration']);

    $router->get($api . '/collections', [ImageController::class, 'getCollections']);

    // Health check
    $router->get($api . '/health', function ($request, $response) {
        $response->getBody()->write(json_encode([
            'status' => 'healthy',
            'version' => $_ENV['API_VERSION'] ?? 'v1',
            'timestamp' => date('c')
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Direct routes (without API prefix) for backward compatibility and direct browser access
    $router->get('/generator-types', [GeneratorTypesController::class, 'getAll']);
    $router->get('/generator-types/names', [GeneratorTypesController::class, 'getNames']);
    $router->post('/generator-types', [GeneratorTypesController::class, 'create']);
    $router->put('/generator-types/{id}', [GeneratorTypesController::class, 'update']);
    $router->delete('/generator-types/{id}', [GeneratorTypesController::class, 'delete']);

    $router->get('/templates', [TemplateController::class, 'getAll']);
    $router->get('/templates/popular', [TemplateController::class, 'getPopular']);
    $router->get('/templates/recent', [TemplateController::class, 'getRecent']);
    $router->get('/templates/search', [TemplateController::class, 'search']);
    $router->post('/templates', [TemplateController::class, 'create']);
    $router->get('/templates/{id}', [TemplateController::class, 'getById']);
    $router->put('/templates/{id}', [TemplateController::class, 'update']);
    $router->delete('/templates/{id}', [TemplateController::class, 'delete']);
    $router->post('/templates/{id}/use', [TemplateController::class, 'incrementUsage']);
    $router->post('/templates/{id}/clone', [TemplateController::class, 'clone']);

    // Description template routes (direct access - specific routes must come before parameterized routes)
    $router->get('/description-templates', [DescriptionTemplateController::class, 'getTemplates']);
    $router->get('/description-templates/generator-types', [DescriptionTemplateController::class, 'getGeneratorTypes']);
    $router->post('/description-templates/bulk/{generator_type}', [DescriptionTemplateController::class, 'bulkUpdateTemplates']);
    $router->post('/description-templates', [DescriptionTemplateController::class, 'createTemplate']);
    $router->get('/description-templates/{id}', [DescriptionTemplateController::class, 'getTemplate']);
    $router->put('/description-templates/{id}', [DescriptionTemplateController::class, 'updateTemplate']);
    $router->delete('/description-templates/{id}', [DescriptionTemplateController::class, 'deleteTemplate']);

    // Game assets routes (direct access - specific routes must come before parameterized routes)
    $router->get('/game-assets/types', [GameAssetsController::class, 'getAssetTypes']);
    $router->post('/game-assets/initialize', [GameAssetsController::class, 'initializeAssets']);
    $router->get('/game-assets/{type}', [GameAssetsController::class, 'getAssetsByType']);
    $router->get('/game-assets/{type}/categories', [GameAssetsController::class, 'getCategoriesByType']);

    $router->get('/species', [SpeciesController::class, 'getAll']);
    $router->get('/species/types', [SpeciesController::class, 'getTypes']);

    $router->get('/generator-attributes/{type}', [GeneratorAttributesController::class, 'getAttributes']);
    $router->get('/attributes/{type}', [GeneratorAttributesController::class, 'getAttributes']);

    $router->post('/prompts/generate', [PromptController::class, 'generate']);
    $router->post('/adventurers/generate', [AdventurerController::class, 'generate']);
    $router->post('/adventurers/generate-multiple', [AdventurerController::class, 'generateMultiple']);
    $router->get('/adventurers/options', [AdventurerController::class, 'getAvailableOptions']);
    $router->post('/aliens/generate', [AlienController::class, 'generate']);
    $router->get('/aliens/species-classes', [AlienController::class, 'getSpeciesClasses']);
    $router->get('/aliens/genders', [AlienController::class, 'getGenders']);
    $router->get('/aliens/artistic-styles', [AlienController::class, 'getArtisticStyles']);
    $router->get('/aliens/environments', [AlienController::class, 'getEnvironments']);
    $router->get('/aliens/climates', [AlienController::class, 'getClimates']);

    // User session routes (direct access)
    $router->get('/session', [UserSessionController::class, 'getSession']);
    $router->post('/session/favorites/add', [UserSessionController::class, 'addToFavorites']);
    $router->post('/session/favorites/remove', [UserSessionController::class, 'removeFromFavorites']);
    $router->post('/session/history/add', [UserSessionController::class, 'addToHistory']);
    $router->post('/session/history/clear', [UserSessionController::class, 'clearHistory']);
    $router->post('/session/preferences', [UserSessionController::class, 'updatePreferences']);

    // Auth routes (central login system)
    $router->post('/auth/register', [AuthController::class, 'register']);
    $router->post('/auth/login', [AuthController::class, 'login']);

    // Attribute configuration management (direct access)
    $router->get('/attribute-config', [AttributeConfigController::class, 'getConfigs'], [JwtMiddleware::class]);
    $router->post('/attribute-config', [AttributeConfigController::class, 'createConfig'], [JwtMiddleware::class]);
    $router->put('/attribute-config/{id}', [AttributeConfigController::class, 'updateConfig'], [JwtMiddleware::class]);
    $router->delete('/attribute-config/{id}', [AttributeConfigController::class, 'deleteConfig'], [JwtMiddleware::class]);

    // Attribute category management (direct access)
    $router->get('/attribute-categories', [AttributeCategoryController::class, 'getCategories'], [JwtMiddleware::class]);
    $router->get('/attribute-categories/{category}/options', [AttributeCategoryController::class, 'getCategoryOptions'], [JwtMiddleware::class]);
    $router->post('/attribute-categories/{category}/options', [AttributeCategoryController::class, 'createCategoryOption'], [JwtMiddleware::class]);
    $router->put('/attribute-options/{id}', [AttributeCategoryController::class, 'updateOption'], [JwtMiddleware::class]);
    $router->delete('/attribute-options/{id}', [AttributeCategoryController::class, 'deleteOption'], [JwtMiddleware::class]);

    // Health check (direct access)
    $router->get('/health', function ($request, $response) {
        $response->getBody()->write(json_encode([
            'status' => 'healthy',
            'version' => $_ENV['API_VERSION'] ?? 'v1',
            'timestamp' => date('c')
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Debug endpoint for authentication
    $router->get($api . '/debug/auth', function ($request, $response) {
        $authHeader = $request->getHeaderLine('Authorization');
        $hasToken = !empty($authHeader);
        $tokenParts = [];

        if ($hasToken && preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            try {
                $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($_ENV['JWT_SECRET'] ?? '', 'HS256'));
                $tokenParts = [
                    'header' => json_decode(base64_decode(explode('.', $token)[0]), true),
                    'payload' => json_decode(base64_decode(explode('.', $token)[1]), true),
                    'valid' => true
                ];
            } catch (\Exception $e) {
                $tokenParts = ['error' => $e->getMessage(), 'valid' => false];
            }
        }

        $response->getBody()->write(json_encode([
            'auth_header_present' => $hasToken,
            'auth_header_value' => $hasToken ? substr($authHeader, 0, 50) . '...' : null,
            'token_info' => $tokenParts,
            'server_time' => date('c'),
            'jwt_secret_configured' => !empty($_ENV['JWT_SECRET'])
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    });

    // Debug page route
    $router->get($api . '/debug', function ($request, $response) {
        $debugHtml = file_get_contents(__DIR__ . '/../public/debug.html');
        $response->getBody()->write($debugHtml);
        return $response->withHeader('Content-Type', 'text/html');
    });
};
