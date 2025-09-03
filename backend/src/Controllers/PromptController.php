<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Actions\GeneratePromptsAction;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class PromptController
{
    public function __construct(
        private readonly GeneratePromptsAction $generatePromptsAction
    ) {}

    public function generate(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            
            $count = (int)($data['count'] ?? 1);
            $type = $data['type'] ?? '';
            $species = $data['species'] ?? null;

            $result = $this->generatePromptsAction->execute($count, $type, $species);
            
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
                'error' => 'Internal server error'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}
