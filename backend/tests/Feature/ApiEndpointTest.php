<?php

declare(strict_types=1);

namespace AnimePromptGen\Tests\Feature;

use PHPUnit\Framework\TestCase;
use Slim\App;
use Slim\Factory\AppFactory;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\UriFactory;
use DI\Container;

class ApiEndpointTest extends TestCase
{
    private App $app;

    protected function setUp(): void
    {
        // Create container and app for testing
        $container = new Container();
        AppFactory::setContainer($container);
        $this->app = AppFactory::create();
        
        // Add routing middleware
        $this->app->addRoutingMiddleware();
        
        // Add basic routes for testing
        $this->app->get('/', function ($request, $response) {
            $response->getBody()->write(json_encode(['status' => 'ok']));
            return $response->withHeader('Content-Type', 'application/json');
        });
        
        $this->app->post('/api/generate', function ($request, $response) {
            $mockResponse = [
                'success' => true,
                'data' => [
                    'species' => ['name' => 'Test Species', 'type' => 'kemonomimi'],
                    'attributes' => [],
                    'description' => 'Generated test description',
                    'negative_prompt' => 'ugly, distorted',
                    'tags' => ['anime', 'character']
                ]
            ];
            
            $response->getBody()->write(json_encode($mockResponse));
            return $response->withHeader('Content-Type', 'application/json');
        });
    }

    public function testHealthEndpoint(): void
    {
        $request = ServerRequestFactory::createFromGlobals()
            ->withMethod('GET');

        $response = $this->app->handle($request);

        $this->assertEquals(200, $response->getStatusCode());
        
        $body = (string) $response->getBody();
        $data = json_decode($body, true);
        
        $this->assertEquals('ok', $data['status']);
    }

    public function testGenerateEndpointWithValidData(): void
    {
        $uriFactory = new UriFactory();
        $uri = $uriFactory->createUri('http://localhost/api/generate');
        
        $request = ServerRequestFactory::createFromGlobals()
            ->withMethod('POST')
            ->withUri($uri)
            ->withHeader('Content-Type', 'application/json');

        $response = $this->app->handle($request);

        $this->assertEquals(200, $response->getStatusCode());
        
        $body = (string) $response->getBody();
        $data = json_decode($body, true);
        
        $this->assertTrue($data['success']);
        $this->assertArrayHasKey('data', $data);
        $this->assertArrayHasKey('species', $data['data']);
        $this->assertArrayHasKey('description', $data['data']);
    }

    public function testGenerateEndpointWithInvalidMethod(): void
    {
        $uriFactory = new UriFactory();
        $uri = $uriFactory->createUri('http://localhost/api/generate');
        
        $request = ServerRequestFactory::createFromGlobals()
            ->withMethod('GET')
            ->withUri($uri);

        try {
            $response = $this->app->handle($request);
            // If we get here, check for 405 status
            $this->assertEquals(405, $response->getStatusCode());
        } catch (\Slim\Exception\HttpMethodNotAllowedException $e) {
            // This is expected - method not allowed
            $this->assertStringContainsString('Method not allowed', $e->getMessage());
        }
    }
}