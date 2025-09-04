<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Actions\GetGameAttributesAction;
use AnimePromptGen\Actions\GetGameAttributeCategoriesAction;
use AnimePromptGen\Actions\InitializeGameAttributesAction;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class GameAssetsController
{
    public function __construct(
        private readonly GetGameAttributesAction $getGameAttributesAction,
        private readonly GetGameAttributeCategoriesAction $getGameAttributeCategoriesAction,
        private readonly InitializeGameAttributesAction $initializeGameAttributesAction
    ) {}

    /**
     * Get all assets by type
     */
    public function getAssetsByType(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $type = $request->getAttribute('type');
            $result = $this->getGameAttributesAction->execute($type);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve assets'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Get all asset categories by type
     */
    public function getCategoriesByType(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $type = $request->getAttribute('type');
            $result = $this->getGameAttributeCategoriesAction->execute($type);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve categories'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Initialize default assets
     */
    public function initializeAssets(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $result = $this->initializeGameAttributesAction->execute();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to initialize assets: ' . $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Get all available asset types
     */
    public function getAssetTypes(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $types = ['climate', 'gender', 'artistic_style', 'environment', 'cultural_artifact', 'experience_level'];
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'types' => $types,
                    'count' => count($types)
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve asset types'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}