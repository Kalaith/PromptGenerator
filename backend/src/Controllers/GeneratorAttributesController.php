<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use AnimePromptGen\Actions\GetGeneratorAttributesAction;

final class GeneratorAttributesController
{
    public function __construct(
        private readonly GetGeneratorAttributesAction $getGeneratorAttributesAction
    ) {}

    public function getAttributes(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $generatorType = $args['type'] ?? '';
            
            if (empty($generatorType)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Generator type is required'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            // Dynamic validation: Check if generator type exists in attribute_config
            $db = \Illuminate\Database\Capsule\Manager::table('attribute_config');
            $typeExists = $db->where('generator_type', $generatorType)->exists();
            
            if (!$typeExists) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Generator type not found: ' . $generatorType
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $result = $this->getGeneratorAttributesAction->execute($generatorType);
            
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
}