<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use Illuminate\Database\Capsule\Manager as DB;

final class GetAttributeOptionsByCategoryAction
{
    public function execute(string $category): array
    {
        try {
            // Get all options for this category
            $options = DB::table('attributes')
                ->select('id', 'value', 'name', 'weight')
                ->where('category', $category)
                ->where('is_active', true)
                ->orderBy('weight', 'desc')
                ->orderBy('name')
                ->get();

            if ($options->isEmpty()) {
                return ['options' => []];
            }

            $result = [];
            foreach ($options as $option) {
                $result[] = [
                    'id' => $option->id,
                    'value' => $option->value ?? $option->name,
                    'label' => $option->name ?? $option->value,
                    'weight' => $option->weight ?? 1
                ];
            }

            return ['options' => $result];

        } catch (\Exception $e) {
            error_log("GetAttributeOptionsByCategoryAction error: " . $e->getMessage());
            throw new \Exception("Failed to get attribute options for category {$category}: " . $e->getMessage());
        }
    }
}