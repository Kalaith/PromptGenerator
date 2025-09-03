<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Actions\GenerateAlienAction;
use AnimePromptGen\External\AlienSpeciesRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Psr7\Response;

final class AlienController
{
    public function __construct(
        private readonly GenerateAlienAction $generateAlienAction,
        private readonly AlienSpeciesRepository $alienSpeciesRepository
    ) {}

    public function generate(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $body = $request->getParsedBody() ?? [];
            
            $count = (int) ($body['count'] ?? 1);
            $speciesClass = $body['species_class'] ?? null;
            $climate = $body['climate'] ?? null;
            $positiveTrait = $body['positive_trait'] ?? null;
            $negativeTrait = $body['negative_trait'] ?? null;
            $style = $body['style'] ?? null;
            $environment = $body['environment'] ?? null;
            $gender = $body['gender'] ?? null;

            $result = $this->generateAlienAction->execute(
                $count,
                $speciesClass,
                $climate,
                $positiveTrait,
                $negativeTrait,
                $style,
                $environment,
                $gender
            );

            $response->getBody()->write(json_encode($result));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $errorResponse = [
                'image_prompts' => [],
                'errors' => [$e->getMessage()]
            ];
            
            $response->getBody()->write(json_encode($errorResponse));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(400);
        }
    }

    public function getSpeciesClasses(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $classes = $this->alienSpeciesRepository->getAllClasses();
            
            $response->getBody()->write(json_encode(['species_classes' => $classes]));
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $errorResponse = ['error' => $e->getMessage()];
            
            $response->getBody()->write(json_encode($errorResponse));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }
}