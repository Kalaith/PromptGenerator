<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Models\GeneratedImage;
use AnimePromptGen\Models\ImageGenerationQueue;
use AnimePromptGen\Models\ImageCollection;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

/**
 * Image Controller
 * 
 * Manages generated images and collections
 */
final class ImageController
{
    /**
     * Complete image generation - called by service worker
     * 
     * POST /api/v1/images/{queue_id}/complete
     */
    public function completeGeneration(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $queueId = (int)$args['queue_id'];
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data) {
                throw new \InvalidArgumentException('Invalid JSON data');
            }
            
            $this->validateImageData($data);
            
            $queueItem = ImageGenerationQueue::findOrFail($queueId);
            
            // Create generated image record
            $generatedImage = GeneratedImage::create([
                'queue_id' => $queueId,
                'prompt_id' => $queueItem->prompt_id,
                'filename' => $data['filename'],
                'original_filename' => $data['original_filename'] ?? null,
                'file_path' => $data['file_path'],
                'file_size_bytes' => $data['file_size_bytes'] ?? null,
                'ftp_path' => $data['ftp_path'] ?? null,
                'gallery_type' => $queueItem->generator_type,
                'gallery_url' => $data['gallery_url'] ?? null,
                'thumbnail_path' => $data['thumbnail_path'] ?? null,
                'width' => $data['width'] ?? $queueItem->width,
                'height' => $data['height'] ?? $queueItem->height,
                'format' => $this->detectImageFormat($data['filename']),
                'generation_params' => array_merge(
                    $queueItem->getGenerationParameters(),
                    $data['generation_params'] ?? []
                ),
                'is_active' => true,
                'is_public' => true,
                'is_featured' => false
            ]);
            
            // Mark queue item as completed
            $queueItem->markAsCompleted();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'image_id' => $generatedImage->id,
                    'queue_id' => $queueId,
                    'filename' => $generatedImage->filename,
                    'gallery_url' => $generatedImage->full_url,
                    'thumbnail_url' => $generatedImage->thumbnail_url,
                    'status' => 'completed'
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
                'error' => 'Failed to complete image generation'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    
    /**
     * Get images with filtering and pagination
     * 
     * GET /api/v1/images?type=anime&limit=20&page=1&session_id=xxx
     */
    public function getImages(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $queryParams = $request->getQueryParams();
            
            $galleryType = $queryParams['type'] ?? null;
            $limit = (int)($queryParams['limit'] ?? 20);
            $page = (int)($queryParams['page'] ?? 1);
            $sessionId = $queryParams['session_id'] ?? null;
            $publicOnly = ($queryParams['public_only'] ?? 'true') === 'true';
            $featured = ($queryParams['featured'] ?? null) === 'true';
            $sortBy = $queryParams['sort_by'] ?? 'recent'; // recent, popular, views, downloads
            
            $query = GeneratedImage::active();
            
            if ($publicOnly) {
                $query->public();
            }
            
            if ($featured) {
                $query->featured();
            }
            
            if ($galleryType) {
                $query->ofGalleryType($galleryType);
            }
            
            // Apply sorting
            switch ($sortBy) {
                case 'popular':
                    $query->byPopularity();
                    break;
                case 'views':
                    $query->orderBy('view_count', 'desc');
                    break;
                case 'downloads':
                    $query->orderBy('download_count', 'desc');
                    break;
                case 'recent':
                default:
                    $query->recent();
                    break;
            }
            
            $total = $query->count();
            $images = $query->offset(($page - 1) * $limit)->limit($limit)->get();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'images' => $images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'filename' => $image->filename,
                            'gallery_type' => $image->gallery_type,
                            'gallery_url' => $image->full_url,
                            'thumbnail_url' => $image->thumbnail_url,
                            'dimensions' => $image->dimensions,
                            'file_size' => $image->formatted_file_size,
                            'format' => $image->format,
                            'view_count' => $image->view_count,
                            'download_count' => $image->download_count,
                            'is_featured' => $image->is_featured,
                            'created_at' => $image->created_at->toISOString()
                        ];
                    }),
                    'pagination' => [
                        'current_page' => $page,
                        'per_page' => $limit,
                        'total_items' => $total,
                        'total_pages' => (int)ceil($total / $limit),
                        'has_more' => $page * $limit < $total
                    ]
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve images'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    
    /**
     * Get single image details
     * 
     * GET /api/v1/images/{id}
     */
    public function getImage(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $imageId = (int)$args['id'];
            $image = GeneratedImage::active()->findOrFail($imageId);
            
            // Increment view count
            $image->incrementViews();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'id' => $image->id,
                    'prompt_id' => $image->prompt_id,
                    'filename' => $image->filename,
                    'gallery_type' => $image->gallery_type,
                    'gallery_url' => $image->full_url,
                    'thumbnail_url' => $image->thumbnail_url,
                    'width' => $image->width,
                    'height' => $image->height,
                    'dimensions' => $image->dimensions,
                    'aspect_ratio' => $image->aspect_ratio,
                    'file_size_bytes' => $image->file_size_bytes,
                    'file_size' => $image->formatted_file_size,
                    'format' => $image->format,
                    'generation_params' => $image->generation_params,
                    'view_count' => $image->view_count,
                    'download_count' => $image->download_count,
                    'is_featured' => $image->is_featured,
                    'is_landscape' => $image->is_landscape,
                    'is_portrait' => $image->is_portrait,
                    'is_square' => $image->is_square,
                    'download_url' => $image->download_url,
                    'collections' => $image->collections->map(function ($collection) {
                        return [
                            'id' => $collection->id,
                            'name' => $collection->name
                        ];
                    }),
                    'created_at' => $image->created_at->toISOString(),
                    'updated_at' => $image->updated_at->toISOString()
                ]
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Image not found'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }
    }
    
    /**
     * Download image with tracking
     * 
     * GET /api/v1/images/{id}/download
     */
    public function downloadImage(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $imageId = (int)$args['id'];
            $image = GeneratedImage::active()->findOrFail($imageId);
            
            // Increment download count
            $image->incrementDownloads();
            
            // Redirect to actual file or serve file
            if ($image->gallery_url) {
                return $response->withHeader('Location', $image->gallery_url)->withStatus(302);
            }
            
            // If no URL, try to serve from file path
            if ($image->file_path && file_exists($image->file_path)) {
                $response->getBody()->write(file_get_contents($image->file_path));
                return $response
                    ->withHeader('Content-Type', $this->getMimeType($image->format))
                    ->withHeader('Content-Disposition', 'attachment; filename="' . $image->filename . '"')
                    ->withHeader('Content-Length', (string)filesize($image->file_path));
            }
            
            throw new \Exception('Image file not found');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Image not found or unavailable'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
        }
    }
    
    /**
     * Get gallery statistics
     * 
     * GET /api/v1/images/stats?type=anime
     */
    public function getGalleryStats(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $queryParams = $request->getQueryParams();
            $galleryType = $queryParams['type'] ?? null;
            
            if (!$galleryType) {
                // Get overall stats
                $stats = [
                    'total_images' => GeneratedImage::active()->public()->count(),
                    'total_views' => GeneratedImage::active()->public()->sum('view_count'),
                    'total_downloads' => GeneratedImage::active()->public()->sum('download_count'),
                    'by_type' => []
                ];
                
                foreach (GeneratedImage::getValidGalleryTypes() as $type) {
                    $stats['by_type'][$type] = GeneratedImage::getGalleryStats($type);
                }
            } else {
                $stats = GeneratedImage::getGalleryStats($galleryType);
            }
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $stats
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve statistics'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    
    /**
     * Get collections
     * 
     * GET /api/v1/collections?featured=true&limit=10
     */
    public function getCollections(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $queryParams = $request->getQueryParams();
            
            $featured = ($queryParams['featured'] ?? null) === 'true';
            $limit = (int)($queryParams['limit'] ?? 20);
            $generatorType = $queryParams['type'] ?? null;
            
            $query = ImageCollection::public()->withImages();
            
            if ($featured) {
                $query->featured();
            }
            
            if ($generatorType) {
                $query->ofGeneratorType($generatorType);
            }
            
            $collections = $query->orderBy('updated_at', 'desc')->limit($limit)->get();
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $collections->map(function ($collection) {
                    return [
                        'id' => $collection->id,
                        'name' => $collection->name,
                        'description' => $collection->description,
                        'generator_type' => $collection->generator_type,
                        'is_featured' => $collection->is_featured,
                        'cover_image_url' => $collection->coverImage?->full_url,
                        'image_count' => $collection->images_count ?? $collection->images()->count(),
                        'preview_images' => $collection->preview_images->map(function ($image) {
                            return [
                                'id' => $image->id,
                                'thumbnail_url' => $image->thumbnail_url
                            ];
                        }),
                        'stats' => $collection->stats,
                        'url' => $collection->url,
                        'created_at' => $collection->created_at->toISOString()
                    ];
                })
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve collections'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
    
    /**
     * Validate image data for completion
     */
    private function validateImageData(array $data): void
    {
        if (empty($data['filename'])) {
            throw new \InvalidArgumentException('Filename is required');
        }
        
        if (empty($data['file_path'])) {
            throw new \InvalidArgumentException('File path is required');
        }
        
        if (isset($data['width']) && $data['width'] <= 0) {
            throw new \InvalidArgumentException('Width must be positive');
        }
        
        if (isset($data['height']) && $data['height'] <= 0) {
            throw new \InvalidArgumentException('Height must be positive');
        }
    }
    
    /**
     * Detect image format from filename
     */
    private function detectImageFormat(string $filename): string
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        return match ($extension) {
            'jpg', 'jpeg' => GeneratedImage::FORMAT_JPG,
            'webp' => GeneratedImage::FORMAT_WEBP,
            'png', default => GeneratedImage::FORMAT_PNG
        };
    }
    
    /**
     * Get MIME type for image format
     */
    private function getMimeType(string $format): string
    {
        return match ($format) {
            GeneratedImage::FORMAT_JPG => 'image/jpeg',
            GeneratedImage::FORMAT_WEBP => 'image/webp',
            GeneratedImage::FORMAT_PNG, default => 'image/png'
        };
    }
}