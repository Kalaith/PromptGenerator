<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\External\GameAssetRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class GameAssetsController
{
    public function __construct(
        private readonly GameAssetRepository $gameAssetRepository
    ) {}

    /**
     * Get all assets by type
     */
    public function getAssetsByType(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        $type = $request->getAttribute('type');
        
        if (!$type) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Type parameter is required'
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        try {
            $assets = $this->gameAssetRepository->getByType($type);
            $assetNames = array_map(fn($asset) => $asset->name, $assets);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'type' => $type,
                    'assets' => $assetNames
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

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
        $type = $request->getAttribute('type');
        
        if (!$type) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Type parameter is required'
            ]));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
        }

        try {
            $categories = $this->gameAssetRepository->getCategoriesByType($type);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'type' => $type,
                    'categories' => $categories
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

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
            $this->gameAssetRepository->initializeDefaultAssets();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Default assets initialized successfully'
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
            $types = ['climate', 'gender', 'artistic_style', 'environment', 'cultural_artifact'];
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'types' => $types
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