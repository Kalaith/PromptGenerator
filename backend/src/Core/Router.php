<?php

declare(strict_types=1);

namespace AnimePromptGen\Core;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use ReflectionMethod;
use Slim\Psr7\Factory\ServerRequestFactory;
use Slim\Psr7\Factory\StreamFactory;
use Slim\Psr7\Response;
use Throwable;

final class Router
{
    private array $routes = [];
    private string $basePath = '';
    private array $globalMiddleware = [];

    public function __construct(
        private readonly ?ContainerInterface $container = null
    ) {}

    public function setBasePath(string $basePath): void
    {
        $this->basePath = rtrim($basePath, '/');
    }

    public function addMiddleware(callable|string $middleware): void
    {
        $this->globalMiddleware[] = $middleware;
    }

    public function post(string $path, array|callable $handler, array $middleware = []): void
    {
        $this->addRoute('POST', $path, $handler, $middleware);
    }

    public function get(string $path, array|callable $handler, array $middleware = []): void
    {
        $this->addRoute('GET', $path, $handler, $middleware);
    }

    public function put(string $path, array|callable $handler, array $middleware = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middleware);
    }

    public function delete(string $path, array|callable $handler, array $middleware = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middleware);
    }

    private function addRoute(string $method, string $path, array|callable $handler, array $middleware): void
    {
        $pattern = preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $path);
        $pattern = "#^" . $pattern . "$#";

        $this->routes[] = [
            'method' => $method,
            'pattern' => $pattern,
            'handler' => $handler,
            'middleware' => $middleware
        ];
    }

    public function handle(): void
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = explode('?', $uri)[0];

        if (!empty($this->basePath) && strpos($path, $this->basePath) === 0) {
            $path = substr($path, strlen($this->basePath));
        }

        if ($path === '') {
            $path = '/';
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $method && preg_match($route['pattern'], $path, $matches)) {
                $routeParams = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);

                $request = $this->buildRequest();
                $response = new Response();

                $middlewares = array_merge($this->globalMiddleware, $route['middleware']);
                foreach ($middlewares as $mw) {
                    $mwInstance = is_string($mw) ? new $mw() : $mw;
                    $result = $mwInstance($request, $response, $routeParams);
                    if ($result === false) {
                        return;
                    }
                }

                try {
                    $response = $this->invokeHandler($route['handler'], $request, $response, $routeParams);
                } catch (Throwable $e) {
                    $response = $this->writeJson($response->withStatus(500), [
                        'success' => false,
                        'error' => 'Internal server error'
                    ]);
                }

                $this->emit($this->withCors($response));
                return;
            }
        }

        $response = $this->writeJson((new Response())->withStatus(404), [
            'success' => false,
            'error' => 'Route not found: ' . $path
        ]);

        $this->emit($this->withCors($response));
    }

    private function buildRequest(): ServerRequestInterface
    {
        $request = ServerRequestFactory::createFromGlobals();
        $rawBody = (string)$request->getBody();

        $stream = (new StreamFactory())->createStream($rawBody);
        $request = $request->withBody($stream);

        $contentType = $request->getHeaderLine('Content-Type');
        if (stripos($contentType, 'application/json') !== false && $rawBody !== '') {
            $decoded = json_decode($rawBody, true);
            if (is_array($decoded)) {
                $request = $request->withParsedBody($decoded);
            }
        } elseif (!empty($_POST)) {
            $request = $request->withParsedBody($_POST);
        }

        return $request;
    }

    private function invokeHandler(array|callable $handler, ServerRequestInterface $request, ResponseInterface $response, array $routeParams): ResponseInterface
    {
        if (is_callable($handler)) {
            $result = $handler($request, $response, $routeParams);
            return $result instanceof ResponseInterface ? $result : $response;
        }

        $controllerClass = $handler[0];
        $methodName = $handler[1];

        $controller = $this->container ? $this->container->get($controllerClass) : new $controllerClass();

        $method = new ReflectionMethod($controller, $methodName);
        $paramCount = $method->getNumberOfParameters();

        if ($paramCount >= 3) {
            $result = $controller->$methodName($request, $response, $routeParams);
        } else {
            $result = $controller->$methodName($request, $response);
        }

        return $result instanceof ResponseInterface ? $result : $response;
    }

    private function writeJson(ResponseInterface $response, array $payload): ResponseInterface
    {
        $response->getBody()->write(json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json');
    }

    private function withCors(ResponseInterface $response): ResponseInterface
    {
        return $response
            ->withHeader('Access-Control-Allow-Origin', '*')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Origin, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    }

    private function emit(ResponseInterface $response): void
    {
        if (!headers_sent()) {
            http_response_code($response->getStatusCode());
            foreach ($response->getHeaders() as $name => $values) {
                foreach ($values as $value) {
                    header(sprintf('%s: %s', $name, $value), false);
                }
            }
        }

        echo (string)$response->getBody();
    }
}
