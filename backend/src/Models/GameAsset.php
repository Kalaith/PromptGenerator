<?php

declare(strict_types=1);

namespace AnimePromptGen\Models;

/**
 * Represents game assets like environments, artifacts, styles, etc.
 * that can be used in prompt generation
 */
final class GameAsset
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $type, // 'climate', 'gender', 'artistic_style', 'environment', 'cultural_artifact'
        public readonly string $category, // e.g. 'wet', 'dry', 'cold' for climates
        public readonly ?string $description,
        public readonly bool $is_active = true,
        public readonly int $weight = 1, // for weighted random selection
        public readonly ?\DateTime $created_at = null,
        public readonly ?\DateTime $updated_at = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: (int) $data['id'],
            name: (string) $data['name'],
            type: (string) $data['type'],
            category: (string) $data['category'],
            description: $data['description'] ?? null,
            is_active: (bool) ($data['is_active'] ?? true),
            weight: (int) ($data['weight'] ?? 1),
            created_at: isset($data['created_at']) ? new \DateTime($data['created_at']) : null,
            updated_at: isset($data['updated_at']) ? new \DateTime($data['updated_at']) : null
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'category' => $this->category,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'weight' => $this->weight,
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s')
        ];
    }
}