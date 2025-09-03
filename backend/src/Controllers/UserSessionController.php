<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\External\UserSessionRepository;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Slim\Psr7\Response;

final class UserSessionController
{
    public function __construct(
        private readonly UserSessionRepository $userSessionRepository
    ) {}

    public function getSession(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $sessionId = $request->getQueryParams()['session_id'] ?? null;
            
            if (!$sessionId) {
                $errorResponse = ['error' => 'session_id is required'];
                $response->getBody()->write(json_encode($errorResponse));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $session = $this->userSessionRepository->findBySessionId($sessionId);
            
            if (!$session) {
                // Create a new session
                $session = $this->userSessionRepository->createOrUpdate($sessionId, [
                    'favorites' => [],
                    'history' => [],
                    'preferences' => []
                ]);
            }

            $response->getBody()->write(json_encode([
                'session_id' => $session->session_id,
                'favorites' => $session->favorites,
                'history' => $session->history,
                'preferences' => $session->preferences
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $errorResponse = ['error' => $e->getMessage()];
            
            $response->getBody()->write(json_encode($errorResponse));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function addToFavorites(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $body = $request->getParsedBody() ?? [];
            $sessionId = $body['session_id'] ?? null;
            $promptId = $body['prompt_id'] ?? null;

            if (!$sessionId || !$promptId) {
                $errorResponse = ['error' => 'session_id and prompt_id are required'];
                $response->getBody()->write(json_encode($errorResponse));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $session = $this->userSessionRepository->addToFavorites($sessionId, $promptId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'favorites' => $session->favorites
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $errorResponse = ['error' => $e->getMessage()];
            
            $response->getBody()->write(json_encode($errorResponse));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function removeFromFavorites(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $body = $request->getParsedBody() ?? [];
            $sessionId = $body['session_id'] ?? null;
            $promptId = $body['prompt_id'] ?? null;

            if (!$sessionId || !$promptId) {
                $errorResponse = ['error' => 'session_id and prompt_id are required'];
                $response->getBody()->write(json_encode($errorResponse));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $session = $this->userSessionRepository->removeFromFavorites($sessionId, $promptId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'favorites' => $session->favorites
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $errorResponse = ['error' => $e->getMessage()];
            
            $response->getBody()->write(json_encode($errorResponse));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function addToHistory(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $body = $request->getParsedBody() ?? [];
            $sessionId = $body['session_id'] ?? null;
            $prompt = $body['prompt'] ?? null;

            if (!$sessionId || !$prompt) {
                $errorResponse = ['error' => 'session_id and prompt are required'];
                $response->getBody()->write(json_encode($errorResponse));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $session = $this->userSessionRepository->addToHistory($sessionId, $prompt);

            $response->getBody()->write(json_encode([
                'success' => true,
                'history' => $session->history
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $errorResponse = ['error' => $e->getMessage()];
            
            $response->getBody()->write(json_encode($errorResponse));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function clearHistory(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $body = $request->getParsedBody() ?? [];
            $sessionId = $body['session_id'] ?? null;

            if (!$sessionId) {
                $errorResponse = ['error' => 'session_id is required'];
                $response->getBody()->write(json_encode($errorResponse));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $session = $this->userSessionRepository->clearHistory($sessionId);

            $response->getBody()->write(json_encode([
                'success' => true,
                'history' => $session->history
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $errorResponse = ['error' => $e->getMessage()];
            
            $response->getBody()->write(json_encode($errorResponse));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function updatePreferences(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $body = $request->getParsedBody() ?? [];
            $sessionId = $body['session_id'] ?? null;
            $preferences = $body['preferences'] ?? null;

            if (!$sessionId || !is_array($preferences)) {
                $errorResponse = ['error' => 'session_id and preferences are required'];
                $response->getBody()->write(json_encode($errorResponse));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $session = $this->userSessionRepository->updatePreferences($sessionId, $preferences);

            $response->getBody()->write(json_encode([
                'success' => true,
                'preferences' => $session->preferences
            ]));
            
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