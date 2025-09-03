<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Actions\GenerateAdventurerAction;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class AdventurerController
{
    public function __construct(
        private readonly GenerateAdventurerAction $generateAdventurerAction
    ) {}

    public function generate(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            
            $race = $data['race'] ?? null;
            $className = $data['class'] ?? null;
            $experience = $data['experience'] ?? null;

            $result = $this->generateAdventurerAction->execute($race, $className, $experience);
            
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

    public function generateMultiple(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            $count = (int)($data['count'] ?? 1);

            $result = $this->generateAdventurerAction->executeMultiple($count);
            
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
