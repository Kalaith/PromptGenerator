<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Generated Image Model
 * 
 * Represents a successfully generated image
 * 
 * @property int $id
 * @property int|null $queue_id
 * @property string $prompt_id
 * @property string $filename
 * @property string|null $original_filename
 * @property string $file_path
 * @property int|null $file_size_bytes
 * @property string|null $ftp_path
 * @property string $gallery_type
 * @property string|null $gallery_url
 * @property string|null $thumbnail_path
 * @property int|null $width
 * @property int|null $height
 * @property string $format
 * @property array|null $generation_params
 * @property bool $is_active
 * @property bool $is_public
 * @property bool $is_featured
 * @property int $view_count
 * @property int $download_count
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class GeneratedImage extends Model
{
    protected $table = 'generated_images';

    protected $fillable = [
        'queue_id',
        'prompt_id',
        'filename',
        'original_filename',
        'file_path',
        'file_size_bytes',
        'ftp_path',
        'gallery_type',
        'gallery_url',
        'thumbnail_path',
        'width',
        'height',
        'format',
        'generation_params',
        'is_active',
        'is_public',
        'is_featured'
    ];

    protected $casts = [
        'generation_params' => 'array',
        'is_active' => 'boolean',
        'is_public' => 'boolean',
        'is_featured' => 'boolean',
        'file_size_bytes' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'view_count' => 'integer',
        'download_count' => 'integer'
    ];

    // Format constants
    public const FORMAT_PNG = 'png';
    public const FORMAT_JPG = 'jpg';
    public const FORMAT_WEBP = 'webp';

    // Gallery type constants (matching generator types)
    public const GALLERY_ANIME = 'anime';
    public const GALLERY_ALIEN = 'alien';
    public const GALLERY_RACE = 'race';
    public const GALLERY_MONSTER = 'monster';
    public const GALLERY_MONSTER_GIRL = 'monsterGirl';
    public const GALLERY_ANIMAL_GIRL = 'animalGirl';

    /**
     * Relationship to generation queue item
     */
    public function queueItem(): BelongsTo
    {
        return $this->belongsTo(ImageGenerationQueue::class, 'queue_id');
    }

    /**
     * Many-to-many relationship with collections
     */
    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(
            ImageCollection::class,
            'collection_images',
            'image_id',
            'collection_id'
        )->withPivot('sort_order', 'added_at')
          ->orderByPivot('sort_order');
    }

    /**
     * Scope for active images
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for public images
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope for featured images
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for specific gallery type
     */
    public function scopeOfGalleryType($query, string $galleryType)
    {
        return $query->where('gallery_type', $galleryType);
    }

    /**
     * Scope for ordering by popularity (views + downloads)
     */
    public function scopeByPopularity($query)
    {
        return $query->orderByRaw('(view_count + download_count * 2) DESC');
    }

    /**
     * Scope for recent images
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Scope for images with minimum size
     */
    public function scopeMinSize($query, int $minWidth = 512, int $minHeight = 512)
    {
        return $query->where('width', '>=', $minWidth)
                    ->where('height', '>=', $minHeight);
    }

    /**
     * Increment view count
     */
    public function incrementViews(): bool
    {
        return $this->increment('view_count');
    }

    /**
     * Increment download count
     */
    public function incrementDownloads(): bool
    {
        return $this->increment('download_count');
    }

    /**
     * Get human-readable file size
     */
    public function getFormattedFileSizeAttribute(): string
    {
        if (!$this->file_size_bytes) {
            return 'Unknown';
        }

        $bytes = $this->file_size_bytes;
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get image dimensions as string
     */
    public function getDimensionsAttribute(): string
    {
        if (!$this->width || !$this->height) {
            return 'Unknown';
        }
        
        return $this->width . 'x' . $this->height;
    }

    /**
     * Get aspect ratio
     */
    public function getAspectRatioAttribute(): ?float
    {
        if (!$this->width || !$this->height) {
            return null;
        }
        
        return round($this->width / $this->height, 2);
    }

    /**
     * Check if image is landscape
     */
    public function getIsLandscapeAttribute(): bool
    {
        return $this->aspect_ratio > 1.0;
    }

    /**
     * Check if image is portrait
     */
    public function getIsPortraitAttribute(): bool
    {
        return $this->aspect_ratio < 1.0;
    }

    /**
     * Check if image is square
     */
    public function getIsSquareAttribute(): bool
    {
        return abs($this->aspect_ratio - 1.0) < 0.1;
    }

    /**
     * Get full URL for image
     */
    public function getFullUrlAttribute(): string
    {
        if ($this->gallery_url) {
            return $this->gallery_url;
        }
        
        // Fallback to constructed URL
        $baseUrl = $_ENV['GALLERY_BASE_URL'] ?? '/gallery';
        return $baseUrl . '/' . $this->gallery_type . '/' . $this->filename;
    }

    /**
     * Get thumbnail URL
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail_path) {
            return null;
        }
        
        $baseUrl = $_ENV['GALLERY_BASE_URL'] ?? '/gallery';
        return $baseUrl . '/' . $this->gallery_type . '/thumbnails/' . basename($this->thumbnail_path);
    }

    /**
     * Get download URL with tracking
     */
    public function getDownloadUrlAttribute(): string
    {
        return '/api/v1/images/' . $this->id . '/download';
    }

    /**
     * Get all valid gallery types
     */
    public static function getValidGalleryTypes(): array
    {
        return [
            self::GALLERY_ANIME,
            self::GALLERY_ALIEN,
            self::GALLERY_RACE,
            self::GALLERY_MONSTER,
            self::GALLERY_MONSTER_GIRL,
            self::GALLERY_ANIMAL_GIRL
        ];
    }

    /**
     * Get all valid formats
     */
    public static function getValidFormats(): array
    {
        return [
            self::FORMAT_PNG,
            self::FORMAT_JPG,
            self::FORMAT_WEBP
        ];
    }

    /**
     * Create thumbnail filename from main filename
     */
    public static function createThumbnailFilename(string $filename): string
    {
        $pathInfo = pathinfo($filename);
        return $pathInfo['filename'] . '_thumb.' . $pathInfo['extension'];
    }

    /**
     * Generate gallery filename with timestamp and parameters
     */
    public static function generateGalleryFilename(
        string $galleryType, 
        int $width, 
        int $height, 
        string $extension = 'png'
    ): string {
        $timestamp = date('YmdHis');
        $random = substr(md5(uniqid()), 0, 6);
        
        return sprintf(
            '%s_%dx%d_%s_%s.%s',
            $galleryType,
            $width,
            $height,
            $timestamp,
            $random,
            $extension
        );
    }

    /**
     * Get summary statistics for gallery type
     */
    public static function getGalleryStats(string $galleryType): array
    {
        $query = static::active()->public()->ofGalleryType($galleryType);
        
        return [
            'total_images' => $query->count(),
            'total_views' => $query->sum('view_count'),
            'total_downloads' => $query->sum('download_count'),
            'average_size_mb' => $query->avg('file_size_bytes') / (1024 * 1024),
            'most_popular' => $query->byPopularity()->first(),
            'most_recent' => $query->recent()->first()
        ];
    }
}