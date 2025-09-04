<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use AnimePromptGen\Actions\GetAnimeAttributesAction;

final class AnimeAttributesController
{
    public function __construct(
        private readonly GetAnimeAttributesAction $getAnimeAttributesAction
    ) {}

    public function getAttributes(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $result = $this->getAnimeAttributesAction->execute();
            
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