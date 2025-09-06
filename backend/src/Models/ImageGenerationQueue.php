<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

/**
 * Image Generation Queue Model
 * 
 * Manages the queue of image generation requests
 * 
 * @property int $id
 * @property string $prompt_id
 * @property string $generator_type
 * @property string $prompt_text
 * @property string|null $negative_prompt
 * @property int $width
 * @property int $height
 * @property int $steps
 * @property float $cfg_scale
 * @property int $seed
 * @property string $model
 * @property string $sampler
 * @property string $scheduler
 * @property int $priority
 * @property string|null $requested_by
 * @property string|null $session_id
 * @property array|null $original_prompt_data
 * @property string $status
 * @property int $attempts
 * @property int $max_attempts
 * @property Carbon|null $processing_started_at
 * @property Carbon|null $processing_completed_at
 * @property string|null $error_message
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class ImageGenerationQueue extends Model
{
    protected $table = 'image_generation_queue';

    protected $fillable = [
        'prompt_id',
        'generator_type',
        'prompt_text',
        'negative_prompt',
        'width',
        'height',
        'steps',
        'cfg_scale',
        'seed',
        'model',
        'sampler',
        'scheduler',
        'priority',
        'requested_by',
        'session_id',
        'original_prompt_data',
        'status',
        'max_attempts'
    ];

    protected $casts = [
        'original_prompt_data' => 'array',
        'processing_started_at' => 'datetime',
        'processing_completed_at' => 'datetime',
        'cfg_scale' => 'float',
        'width' => 'integer',
        'height' => 'integer',
        'steps' => 'integer',
        'seed' => 'integer',
        'priority' => 'integer',
        'attempts' => 'integer',
        'max_attempts' => 'integer'
    ];

    // Status constants
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    // Generator type constants
    public const TYPE_ANIME = 'anime';
    public const TYPE_ALIEN = 'alien';
    public const TYPE_RACE = 'race';
    public const TYPE_MONSTER = 'monster';
    public const TYPE_MONSTER_GIRL = 'monsterGirl';
    public const TYPE_ANIMAL_GIRL = 'animalGirl';

    // Default generation parameters
    public const DEFAULT_WIDTH = 1024;
    public const DEFAULT_HEIGHT = 1024;
    public const DEFAULT_STEPS = 20;
    public const DEFAULT_CFG_SCALE = 8.0;
    public const DEFAULT_MODEL = 'juggernautXL_v8Rundiffusion.safetensors';
    public const DEFAULT_SAMPLER = 'euler';
    public const DEFAULT_SCHEDULER = 'normal';

    /**
     * Relationship to generated image
     */
    public function generatedImage(): HasOne
    {
        return $this->hasOne(GeneratedImage::class, 'queue_id');
    }

    /**
     * Scope for pending items
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope for processing items
     */
    public function scopeProcessing($query)
    {
        return $query->where('status', self::STATUS_PROCESSING);
    }

    /**
     * Scope for completed items
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    /**
     * Scope for failed items
     */
    public function scopeFailed($query)
    {
        return $query->where('status', self::STATUS_FAILED);
    }

    /**
     * Scope for ordered by priority
     */
    public function scopeByPriority($query)
    {
        return $query->orderBy('priority', 'desc')->orderBy('created_at', 'asc');
    }

    /**
     * Scope for specific generator type
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('generator_type', $type);
    }

    /**
     * Scope for specific session
     */
    public function scopeForSession($query, string $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    /**
     * Check if item can be retried
     */
    public function canRetry(): bool
    {
        return $this->attempts < $this->max_attempts && 
               in_array($this->status, [self::STATUS_FAILED, self::STATUS_PENDING]);
    }

    /**
     * Mark as processing
     */
    public function markAsProcessing(): bool
    {
        $this->status = self::STATUS_PROCESSING;
        $this->processing_started_at = new \DateTime();
        $this->attempts++;
        
        return $this->save();
    }

    /**
     * Mark as completed
     */
    public function markAsCompleted(): bool
    {
        $this->status = self::STATUS_COMPLETED;
        $this->processing_completed_at = new \DateTime();
        $this->error_message = null;
        
        return $this->save();
    }

    /**
     * Mark as failed with error message
     */
    public function markAsFailed(string $errorMessage): bool
    {
        $this->status = self::STATUS_FAILED;
        $this->processing_completed_at = new \DateTime();
        $this->error_message = $errorMessage;
        
        return $this->save();
    }

    /**
     * Mark as cancelled
     */
    public function markAsCancelled(): bool
    {
        $this->status = self::STATUS_CANCELLED;
        $this->processing_completed_at = new \DateTime();
        
        return $this->save();
    }

    /**
     * Get processing duration in seconds
     */
    public function getProcessingDurationAttribute(): ?int
    {
        if (!$this->processing_started_at || !$this->processing_completed_at) {
            return null;
        }
        
        return $this->processing_completed_at->diffInSeconds($this->processing_started_at);
    }

    /**
     * Get estimated completion time
     */
    public function getEstimatedCompletionAttribute(): ?Carbon
    {
        if ($this->status !== self::STATUS_PENDING) {
            return null;
        }

        // Get average processing time for this generator type
        $avgProcessingTime = static::where('generator_type', $this->generator_type)
            ->where('status', self::STATUS_COMPLETED)
            ->whereNotNull('processing_started_at')
            ->whereNotNull('processing_completed_at')
            ->get()
            ->avg(function ($item) {
                return $item->processing_duration;
            });

        if (!$avgProcessingTime) {
            $avgProcessingTime = 300; // Default 5 minutes
        }

        // Count items ahead in queue
        $queuePosition = static::pending()
            ->byPriority()
            ->where('created_at', '<', $this->created_at)
            ->count();

        return (new \DateTime())->add(new \DateInterval("PT{$avgProcessingTime}S"))->add(new \DateInterval("PT" . ($avgProcessingTime * $queuePosition) . "S"));
    }

    /**
     * Get queue position
     */
    public function getQueuePositionAttribute(): int
    {
        return static::pending()
            ->byPriority()
            ->where('created_at', '<', $this->created_at)
            ->count() + 1;
    }

    /**
     * Get all valid generator types
     */
    public static function getValidGeneratorTypes(): array
    {
        return [
            self::TYPE_ANIME,
            self::TYPE_ALIEN,
            self::TYPE_RACE,
            self::TYPE_MONSTER,
            self::TYPE_MONSTER_GIRL,
            self::TYPE_ANIMAL_GIRL
        ];
    }

    /**
     * Get all valid statuses
     */
    public static function getValidStatuses(): array
    {
        return [
            self::STATUS_PENDING,
            self::STATUS_PROCESSING,
            self::STATUS_COMPLETED,
            self::STATUS_FAILED,
            self::STATUS_CANCELLED
        ];
    }

    /**
     * Create generation parameters array for service worker
     */
    public function getGenerationParameters(): array
    {
        return [
            'prompt' => $this->prompt_text,
            'negative_prompt' => $this->negative_prompt,
            'width' => $this->width,
            'height' => $this->height,
            'steps' => $this->steps,
            'cfg_scale' => $this->cfg_scale,
            'seed' => $this->seed,
            'model' => $this->model,
            'sampler' => $this->sampler,
            'scheduler' => $this->scheduler
        ];
    }
}