<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Models\ImageGenerationQueue;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Ramsey\Uuid\Uuid;

/**
 * Image Queue Controller
 * 
 * Manages the image generation queue
 */
final class ImageQueueController
{
    /**
     * Queue new image generation request
     * 
     * POST /api/v1/images/generate
     */
    public function queueGeneration(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data) {
                throw new \InvalidArgumentException('Invalid JSON data');
            }
            
            // Validate required fields
            $this->validateGenerationRequest($data);
            
            // Generate unique prompt ID
            $promptId = Uuid::uuid4()->toString();
            
            // Create queue item
            $queueItem = ImageGenerationQueue::create([
                'prompt_id' => $promptId,
                'generator_type' => $data['generator_type'],
                'prompt_text' => $data['prompt_text'],
                'negative_prompt' => $data['negative_prompt'] ?? '',
                'width' => $data['width'] ?? ImageGenerationQueue::DEFAULT_WIDTH,
                'height' => $data['height'] ?? ImageGenerationQueue::DEFAULT_HEIGHT,
                'steps' => $data['steps'] ?? ImageGenerationQueue::DEFAULT_STEPS,
                'cfg_scale' => $data['cfg_scale'] ?? ImageGenerationQueue::DEFAULT_CFG_SCALE,
                'seed' => $data['seed'] ?? -1,
                'model' => $data['model'] ?? ImageGenerationQueue::DEFAULT_MODEL,
                'sampler' => $data['sampler'] ?? ImageGenerationQueue::DEFAULT_SAMPLER,
                'scheduler' => $data['scheduler'] ?? ImageGenerationQueue::DEFAULT_SCHEDULER,
                'priority' => $data['priority'] ?? 0,
                'requested_by' => $data['requested_by'] ?? null,
                'session_id' => $data['session_id'] ?? null,
                'original_prompt_data' => $data['original_prompt_data'] ?? null,
                'max_attempts' => $data['max_attempts'] ?? 3
            ]);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'prompt_id' => $promptId,
                    'queue_id' => $queueItem->id,
                    'queue_position' => $queueItem->queue_position,
                    'estimated_completion' => $queueItem->estimated_completion?->toISOString(),
                    'status' => $queueItem->status
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);
            
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
    
    /**
     * Get pending queue items for service worker
     * 
     * GET /api/v1/images/queue?limit=10&type=anime
     */
    public function getQueue(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $queryParams = $request->getQueryParams();
            $limit = (int)($queryParams['limit'] ?? 10);
            $generatorType = $queryParams['type'] ?? null;
            $status = $queryParams['status'] ?? ImageGenerationQueue::STATUS_PENDING;
            
            $query = ImageGenerationQueue::where('status', $status)
                ->byPriority();
                
            if ($generatorType) {
                $query->ofType($generatorType);
            }
            
            $queueItems = $query->limit($limit)->get();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $queueItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'prompt_id' => $item->prompt_id,
                        'generator_type' => $item->generator_type,
                        'prompt_text' => $item->prompt_text,
                        'negative_prompt' => $item->negative_prompt,
                        'parameters' => $item->getGenerationParameters(),
                        'priority' => $item->priority,
                        'attempts' => $item->attempts,
                        'max_attempts' => $item->max_attempts,
                        'created_at' => $item->created_at->toISOString()
                    ];
                })
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve queue'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    
    /**
     * Update queue item status
     * 
     * PUT /api/v1/images/queue/{id}/status
     */
    public function updateStatus(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $queueId = (int)$args['id'];
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data || !isset($data['status'])) {
                throw new \InvalidArgumentException('Status is required');
            }
            
            $queueItem = ImageGenerationQueue::findOrFail($queueId);
            $newStatus = $data['status'];
            
            // Validate status transition
            if (!in_array($newStatus, ImageGenerationQueue::getValidStatuses())) {
                throw new \InvalidArgumentException('Invalid status');
            }
            
            // Update based on status
            switch ($newStatus) {
                case ImageGenerationQueue::STATUS_PROCESSING:
                    $queueItem->markAsProcessing();
                    break;
                    
                case ImageGenerationQueue::STATUS_COMPLETED:
                    $queueItem->markAsCompleted();
                    break;
                    
                case ImageGenerationQueue::STATUS_FAILED:
                    $errorMessage = $data['error_message'] ?? 'Generation failed';
                    $queueItem->markAsFailed($errorMessage);
                    break;
                    
                case ImageGenerationQueue::STATUS_CANCELLED:
                    $queueItem->markAsCancelled();
                    break;
                    
                default:
                    $queueItem->status = $newStatus;
                    $queueItem->save();
            }
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'id' => $queueItem->id,
                    'status' => $queueItem->status,
                    'attempts' => $queueItem->attempts,
                    'updated_at' => $queueItem->updated_at->toISOString()
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to update status'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    
    /**
     * Get queue status for specific session
     * 
     * GET /api/v1/images/queue/status?session_id=xxx
     */
    public function getQueueStatus(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $queryParams = $request->getQueryParams();
            $sessionId = $queryParams['session_id'] ?? null;
            
            if (!$sessionId) {
                throw new \InvalidArgumentException('Session ID is required');
            }
            
            $queueItems = ImageGenerationQueue::forSession($sessionId)
                ->orderBy('created_at', 'desc')
                ->get();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $queueItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'prompt_id' => $item->prompt_id,
                        'generator_type' => $item->generator_type,
                        'prompt_text' => substr($item->prompt_text, 0, 100) . '...',
                        'status' => $item->status,
                        'queue_position' => $item->status === ImageGenerationQueue::STATUS_PENDING 
                            ? $item->queue_position 
                            : null,
                        'estimated_completion' => $item->estimated_completion?->toISOString(),
                        'processing_duration' => $item->processing_duration,
                        'error_message' => $item->error_message,
                        'created_at' => $item->created_at->toISOString(),
                        'updated_at' => $item->updated_at->toISOString()
                    ];
                })
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve queue status'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    
    /**
     * Cancel queue item
     * 
     * DELETE /api/v1/images/queue/{id}
     */
    public function cancelGeneration(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $queueId = (int)$args['id'];
            $queueItem = ImageGenerationQueue::findOrFail($queueId);
            
            // Only allow cancellation of pending or processing items
            if (!in_array($queueItem->status, [
                ImageGenerationQueue::STATUS_PENDING, 
                ImageGenerationQueue::STATUS_PROCESSING
            ])) {
                throw new \InvalidArgumentException('Cannot cancel completed or failed generation');
            }
            
            $queueItem->markAsCancelled();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'id' => $queueItem->id,
                    'status' => $queueItem->status,
                    'cancelled_at' => $queueItem->updated_at->toISOString()
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to cancel generation'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    
    /**
     * Validate generation request data
     */
    private function validateGenerationRequest(array $data): void
    {
        if (empty($data['generator_type'])) {
            throw new \InvalidArgumentException('Generator type is required');
        }
        
        if (!in_array($data['generator_type'], ImageGenerationQueue::getValidGeneratorTypes())) {
            throw new \InvalidArgumentException('Invalid generator type');
        }
        
        if (empty($data['prompt_text'])) {
            throw new \InvalidArgumentException('Prompt text is required');
        }
        
        if (isset($data['width']) && ($data['width'] < 256 || $data['width'] > 4096)) {
            throw new \InvalidArgumentException('Width must be between 256 and 4096');
        }
        
        if (isset($data['height']) && ($data['height'] < 256 || $data['height'] > 4096)) {
            throw new \InvalidArgumentException('Height must be between 256 and 4096');
        }
        
        if (isset($data['steps']) && ($data['steps'] < 1 || $data['steps'] > 100)) {
            throw new \InvalidArgumentException('Steps must be between 1 and 100');
        }
        
        if (isset($data['cfg_scale']) && ($data['cfg_scale'] < 1.0 || $data['cfg_scale'] > 20.0)) {
            throw new \InvalidArgumentException('CFG scale must be between 1.0 and 20.0');
        }
        
        if (isset($data['priority']) && ($data['priority'] < -10 || $data['priority'] > 10)) {
            throw new \InvalidArgumentException('Priority must be between -10 and 10');
        }
    }
}