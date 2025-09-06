<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use Illuminate\Database\Capsule\Manager as DB;

final class GetAttributeCategoriesAction
{
    public function execute(): array
    {
        try {
            // Get unique categories from attribute_config that are active and select/multi-select
            $categories = DB::table('attribute_config')
                ->select('category', 'label', 'input_type')
                ->where('is_active', true)
                ->whereIn('input_type', ['select', 'multi-select'])
                ->groupBy('category', 'label', 'input_type')
                ->orderBy('label')
                ->get();

            if ($categories->isEmpty()) {
                return ['categories' => []];
            }

            $result = [];
            foreach ($categories as $category) {
                // Get count of actual attribute options for this category
                $optionCount = DB::table('attributes')
                    ->where('category', $category->category)
                    ->where('is_active', true)
                    ->count();

                $result[] = [
                    'category' => $category->category,
                    'label' => $category->label,
                    'input_type' => $category->input_type,
                    'option_count' => $optionCount
                ];
            }

            return ['categories' => $result];

        } catch (\Exception $e) {
            error_log("GetAttributeCategoriesAction error: " . $e->getMessage());
            throw new \Exception("Failed to get attribute categories: " . $e->getMessage());
        }
    }
}