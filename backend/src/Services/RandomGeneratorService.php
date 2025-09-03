<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\AttributeRepository;

final class RandomGeneratorService
{
    public function __construct(
        private readonly AttributeRepository $attributeRepository
    ) {}

    public function getRandomAttribute(string $category): string
    {
        $attributes = $this->attributeRepository->getRandomByCategory($category, 1);
        return $attributes->first()?->value ?? '';
    }

    public function getRandomAttributes(string $category, int $count): array
    {
        $attributes = $this->attributeRepository->getRandomByCategory($category, $count);
        return $attributes->pluck('value')->toArray();
    }

    public function getRandomElement(array $array): string
    {
        if (empty($array)) {
            return '';
        }
        return $array[array_rand($array)];
    }

    public function getRandomElements(array $array, int $count): array
    {
        if (empty($array) || $count <= 0) {
            return [];
        }
        
        $shuffled = $array;
        shuffle($shuffled);
        return array_slice($shuffled, 0, min($count, count($array)));
    }

    public function generateRandomFloat(float $min = 0.0, float $max = 1.0): float
    {
        return $min + (mt_rand() / mt_getrandmax()) * ($max - $min);
    }

    public function generateRandomInt(int $min, int $max): int
    {
        return mt_rand($min, $max);
    }

    public function shouldRandomlyOccur(float $probability = 0.5): bool
    {
        return $this->generateRandomFloat() < $probability;
    }
}
