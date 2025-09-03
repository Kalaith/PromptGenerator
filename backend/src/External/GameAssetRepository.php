<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\GameAsset;
use PDO;

/**
 * Repository for managing game assets like climates, genders, styles, etc.
 */
final class GameAssetRepository
{
    public function __construct(private readonly PDO $pdo) {}

    /**
     * Get all assets by type
     */
    public function getByType(string $type): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM game_assets 
            WHERE type = :type AND is_active = 1 
            ORDER BY category, weight DESC, name
        ');
        $stmt->execute(['type' => $type]);
        
        $assets = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $assets[] = GameAsset::fromArray($row);
        }
        
        return $assets;
    }

    /**
     * Get assets by type and category
     */
    public function getByTypeAndCategory(string $type, string $category): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM game_assets 
            WHERE type = :type AND category = :category AND is_active = 1 
            ORDER BY weight DESC, name
        ');
        $stmt->execute(['type' => $type, 'category' => $category]);
        
        $assets = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $assets[] = GameAsset::fromArray($row);
        }
        
        return $assets;
    }

    /**
     * Get all categories for a given type
     */
    public function getCategoriesByType(string $type): array
    {
        $stmt = $this->pdo->prepare('
            SELECT DISTINCT category 
            FROM game_assets 
            WHERE type = :type AND is_active = 1 
            ORDER BY category
        ');
        $stmt->execute(['type' => $type]);
        
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    /**
     * Get a random asset by type
     */
    public function getRandomByType(string $type): ?GameAsset
    {
        $assets = $this->getByType($type);
        if (empty($assets)) {
            return null;
        }

        // Use weighted random selection
        return $this->getWeightedRandomAsset($assets);
    }

    /**
     * Get a random asset by type and category
     */
    public function getRandomByTypeAndCategory(string $type, string $category): ?GameAsset
    {
        $assets = $this->getByTypeAndCategory($type, $category);
        if (empty($assets)) {
            return null;
        }

        return $this->getWeightedRandomAsset($assets);
    }

    /**
     * Get all assets of multiple types
     */
    public function getAssetsByTypes(array $types): array
    {
        $placeholders = str_repeat('?,', count($types) - 1) . '?';
        $stmt = $this->pdo->prepare("
            SELECT * FROM game_assets 
            WHERE type IN ($placeholders) AND is_active = 1 
            ORDER BY type, category, weight DESC, name
        ");
        $stmt->execute($types);
        
        $assetsByType = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $asset = GameAsset::fromArray($row);
            $assetsByType[$asset->type][] = $asset;
        }
        
        return $assetsByType;
    }

    /**
     * Create a new game asset
     */
    public function create(
        string $name,
        string $type,
        string $category,
        ?string $description = null,
        bool $isActive = true,
        int $weight = 1
    ): GameAsset {
        $stmt = $this->pdo->prepare('
            INSERT INTO game_assets (name, type, category, description, is_active, weight, created_at, updated_at)
            VALUES (:name, :type, :category, :description, :is_active, :weight, NOW(), NOW())
        ');
        
        $stmt->execute([
            'name' => $name,
            'type' => $type,
            'category' => $category,
            'description' => $description,
            'is_active' => $isActive,
            'weight' => $weight
        ]);
        
        $id = (int) $this->pdo->lastInsertId();
        
        return new GameAsset(
            id: $id,
            name: $name,
            type: $type,
            category: $category,
            description: $description,
            is_active: $isActive,
            weight: $weight,
            created_at: new \DateTime(),
            updated_at: new \DateTime()
        );
    }

    /**
     * Weighted random selection from array of assets
     */
    private function getWeightedRandomAsset(array $assets): GameAsset
    {
        $totalWeight = array_sum(array_map(fn($asset) => $asset->weight, $assets));
        $randomWeight = mt_rand(1, $totalWeight);
        
        $currentWeight = 0;
        foreach ($assets as $asset) {
            $currentWeight += $asset->weight;
            if ($randomWeight <= $currentWeight) {
                return $asset;
            }
        }
        
        // Fallback to first asset
        return $assets[0];
    }

    /**
     * Initialize default data for the game assets table
     */
    public function initializeDefaultAssets(): void
    {
        // Climate data
        $climateData = [
            'wet' => ['Continental', 'Ocean', 'Tropical'],
            'dry' => ['Savanna', 'Alpine', 'Steppe'],
            'cold' => ['Desert', 'Tundra', 'Arctic']
        ];

        foreach ($climateData as $category => $climates) {
            foreach ($climates as $climate) {
                $this->createIfNotExists($climate, 'climate', $category);
            }
        }

        // Gender data
        $genders = ['male', 'female'];
        foreach ($genders as $gender) {
            $this->createIfNotExists($gender, 'gender', 'standard');
        }

        // Artistic styles
        $styles = [
            'cyberpunk', 'fantasy', 'realistic', 'surreal', 'biomechanical',
            'retro-futuristic', 'minimalist', 'baroque'
        ];
        foreach ($styles as $style) {
            $this->createIfNotExists($style, 'artistic_style', 'visual');
        }

        // Environments
        $environments = [
            'futuristic cityscape', 'alien jungle', 'desolate wasteland', 'underwater city',
            'orbital space station', 'volcanic landscape', 'crystalline cavern', 'floating sky islands',
            'toxic swamp', 'ancient ruins'
        ];
        foreach ($environments as $environment) {
            $this->createIfNotExists($environment, 'environment', 'setting');
        }

        // Cultural artifacts
        $artifacts = [
            'ceremonial staff', 'holographic data slate', 'glowing amulet', 'intricate blade',
            'tribal mask', 'bioluminescent orb', 'ancient relic', 'futuristic headset',
            'ornate scepter', 'mechanical prosthetic'
        ];
        foreach ($artifacts as $artifact) {
            $this->createIfNotExists($artifact, 'cultural_artifact', 'item');
        }
    }

    /**
     * Create asset if it doesn't already exist
     */
    private function createIfNotExists(string $name, string $type, string $category): void
    {
        $stmt = $this->pdo->prepare('
            SELECT COUNT(*) FROM game_assets WHERE name = :name AND type = :type AND category = :category
        ');
        $stmt->execute(['name' => $name, 'type' => $type, 'category' => $category]);
        
        if ($stmt->fetchColumn() == 0) {
            $this->create($name, $type, $category);
        }
    }
}