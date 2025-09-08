<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\External\GeneratorTypeRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class GeneratorTypesController
{
    public function __construct(
        private readonly GeneratorTypeRepository $generatorTypeRepository
    ) {}

    /**
     * Get all active generator types
     */
    public function getAll(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $types = $this->generatorTypeRepository->getActiveTypes();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'generator_types' => $types
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve generator types'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Get generator type names only
     */
    public function getNames(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $names = $this->generatorTypeRepository->getActiveTypeNames();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'type_names' => $names
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve generator type names'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Create a new generator type
     */
    public function create(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON data'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $generatorType = $this->generatorTypeRepository->create($data);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'generator_type' => $generatorType->toArray()
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to create generator type: ' . $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Update an existing generator type
     */
    public function update(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $id = (int)$args['id'];
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON data'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $generatorType = $this->generatorTypeRepository->findById($id);
            
            if (!$generatorType) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Generator type not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $updatedType = $this->generatorTypeRepository->update($generatorType, $data);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'generator_type' => $updatedType->toArray()
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to update generator type: ' . $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Delete a generator type
     */
    public function delete(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $id = (int)$args['id'];
            
            $generatorType = $this->generatorTypeRepository->findById($id);
            
            if (!$generatorType) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Generator type not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $this->generatorTypeRepository->delete($generatorType);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Generator type deleted successfully'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to delete generator type: ' . $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}