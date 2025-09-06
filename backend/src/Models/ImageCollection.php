<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Image Collection Model
 * 
 * Represents collections/albums of generated images
 * 
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $generator_type
 * @property bool $is_public
 * @property bool $is_featured
 * @property int|null $cover_image_id
 * @property string|null $created_by_session
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class ImageCollection extends Model
{
    protected $table = 'image_collections';

    protected $fillable = [
        'name',
        'description',
        'generator_type',
        'is_public',
        'is_featured',
        'cover_image_id',
        'created_by_session'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_featured' => 'boolean'
    ];

    /**
     * Relationship to cover image
     */
    public function coverImage(): BelongsTo
    {
        return $this->belongsTo(GeneratedImage::class, 'cover_image_id');
    }

    /**
     * Many-to-many relationship with images
     */
    public function images(): BelongsToMany
    {
        return $this->belongsToMany(
            GeneratedImage::class,
            'collection_images',
            'collection_id',
            'image_id'
        )->withPivot('sort_order', 'added_at')
          ->orderByPivot('sort_order')
          ->where('generated_images.is_active', true);
    }

    /**
     * Scope for public collections
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope for featured collections
     */
    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for specific generator type
     */
    public function scopeOfGeneratorType($query, string $generatorType)
    {
        return $query->where('generator_type', $generatorType);
    }

    /**
     * Scope for collections by session
     */
    public function scopeForSession($query, string $sessionId)
    {
        return $query->where('created_by_session', $sessionId);
    }

    /**
     * Scope for collections with images
     */
    public function scopeWithImages($query)
    {
        return $query->has('images');
    }

    /**
     * Add image to collection
     */
    public function addImage(GeneratedImage $image, int $sortOrder = null): bool
    {
        if ($this->images()->where('image_id', $image->id)->exists()) {
            return false; // Image already in collection
        }

        if ($sortOrder === null) {
            $sortOrder = $this->images()->max('sort_order') + 1;
        }

        $this->images()->attach($image->id, [
            'sort_order' => $sortOrder,
            'added_at' => new \DateTime()
        ]);

        // Set as cover image if it's the first image
        if (!$this->cover_image_id) {
            $this->cover_image_id = $image->id;
            $this->save();
        }

        return true;
    }

    /**
     * Remove image from collection
     */
    public function removeImage(GeneratedImage $image): bool
    {
        $this->images()->detach($image->id);

        // Update cover image if needed
        if ($this->cover_image_id === $image->id) {
            $newCoverImage = $this->images()->first();
            $this->cover_image_id = $newCoverImage ? $newCoverImage->id : null;
            $this->save();
        }

        return true;
    }

    /**
     * Reorder images in collection
     */
    public function reorderImages(array $imageIds): bool
    {
        foreach ($imageIds as $index => $imageId) {
            $this->images()->updateExistingPivot($imageId, [
                'sort_order' => $index + 1
            ]);
        }

        return true;
    }

    /**
     * Set cover image
     */
    public function setCoverImage(GeneratedImage $image): bool
    {
        if (!$this->images()->where('image_id', $image->id)->exists()) {
            return false; // Image not in collection
        }

        $this->cover_image_id = $image->id;
        return $this->save();
    }

    /**
     * Get collection statistics
     */
    public function getStatsAttribute(): array
    {
        $images = $this->images;
        
        return [
            'image_count' => $images->count(),
            'total_views' => $images->sum('view_count'),
            'total_downloads' => $images->sum('download_count'),
            'average_rating' => 0, // TODO: Implement rating system
            'created_date' => $this->created_at->format('Y-m-d'),
            'last_updated' => $this->updated_at->format('Y-m-d H:i:s')
        ];
    }

    /**
     * Get collection preview images (first 4)
     */
    public function getPreviewImagesAttribute()
    {
        return $this->images()->limit(4)->get();
    }

    /**
     * Get collection URL slug
     */
    public function getSlugAttribute(): string
    {
        return strtolower(preg_replace('/[^A-Za-z0-9-]+/', '-', $this->name));
    }

    /**
     * Get collection URL
     */
    public function getUrlAttribute(): string
    {
        return '/collections/' . $this->id . '/' . $this->slug;
    }

    /**
     * Check if collection is empty
     */
    public function getIsEmptyAttribute(): bool
    {
        return $this->images()->count() === 0;
    }

    /**
     * Get dominant generator type from images
     */
    public function getDominantGeneratorTypeAttribute(): ?string
    {
        if ($this->generator_type) {
            return $this->generator_type;
        }

        return $this->images()
            ->selectRaw('gallery_type, COUNT(*) as count')
            ->groupBy('gallery_type')
            ->orderBy('count', 'desc')
            ->first()
            ?->gallery_type;
    }

    /**
     * Create default system collections
     */
    public static function createDefaultCollections(): void
    {
        $defaultCollections = [
            [
                'name' => 'Featured Anime Characters',
                'description' => 'Best anime character generations',
                'generator_type' => 'anime',
                'is_public' => true,
                'is_featured' => true,
                'created_by_session' => 'system'
            ],
            [
                'name' => 'Amazing Aliens',
                'description' => 'Top alien species creations',
                'generator_type' => 'alien',
                'is_public' => true,
                'is_featured' => true,
                'created_by_session' => 'system'
            ],
            [
                'name' => 'Epic Adventurers',
                'description' => 'Legendary fantasy characters',
                'generator_type' => 'race',
                'is_public' => true,
                'is_featured' => true,
                'created_by_session' => 'system'
            ],
            [
                'name' => 'Cute Monster Girls',
                'description' => 'Adorable monster girl collection',
                'generator_type' => 'monsterGirl',
                'is_public' => true,
                'is_featured' => true,
                'created_by_session' => 'system'
            ],
            [
                'name' => 'Fierce Monsters',
                'description' => 'Powerful monster designs',
                'generator_type' => 'monster',
                'is_public' => true,
                'is_featured' => true,
                'created_by_session' => 'system'
            ],
            [
                'name' => 'Kawaii Kemonomimi',
                'description' => 'Cute animal-eared characters',
                'generator_type' => 'animalGirl',
                'is_public' => true,
                'is_featured' => true,
                'created_by_session' => 'system'
            ]
        ];

        foreach ($defaultCollections as $collectionData) {
            static::firstOrCreate(
                ['name' => $collectionData['name']],
                $collectionData
            );
        }
    }

    /**
     * Get collections with most images
     */
    public static function getMostPopular(int $limit = 10)
    {
        return static::withImages()
            ->public()
            ->withCount('images')
            ->orderBy('images_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get recently updated collections
     */
    public static function getRecentlyUpdated(int $limit = 10)
    {
        return static::public()
            ->withImages()
            ->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get();
    }
}