<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use AnimePromptGen\Actions\GetAttributeCategoriesAction;
use AnimePromptGen\Actions\GetAttributeOptionsByCategoryAction;
use AnimePromptGen\Actions\CreateAttributeOptionAction;
use AnimePromptGen\Actions\UpdateAttributeOptionAction;
use AnimePromptGen\Actions\DeleteAttributeOptionAction;

final class AttributeCategoryController
{
    public function __construct(
        private readonly GetAttributeCategoriesAction $getAttributeCategoriesAction,
        private readonly GetAttributeOptionsByCategoryAction $getAttributeOptionsByCategoryAction,
        private readonly CreateAttributeOptionAction $createAttributeOptionAction,
        private readonly UpdateAttributeOptionAction $updateAttributeOptionAction,
        private readonly DeleteAttributeOptionAction $deleteAttributeOptionAction
    ) {}

    public function getCategories(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $result = $this->getAttributeCategoriesAction->execute();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function getCategoryOptions(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $category = $args['category'] ?? '';
            
            if (empty($category)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Category is required'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $result = $this->getAttributeOptionsByCategoryAction->execute($category);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function createCategoryOption(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $category = $args['category'] ?? '';
            
            if (empty($category)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Category is required'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $data = $request->getParsedBody() ?? [];
            $result = $this->createAttributeOptionAction->execute($category, $data);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function updateOption(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $id = intval($args['id'] ?? 0);
            
            if ($id <= 0) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Valid option ID is required'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $data = $request->getParsedBody() ?? [];
            $result = $this->updateAttributeOptionAction->execute($id, $data);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function deleteOption(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $id = intval($args['id'] ?? 0);
            
            if ($id <= 0) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Valid option ID is required'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $result = $this->deleteAttributeOptionAction->execute($id);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }
}