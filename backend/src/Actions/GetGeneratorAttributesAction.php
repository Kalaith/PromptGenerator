<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\AttributeRepository;
use Illuminate\Database\Capsule\Manager as DB;

final class GetGeneratorAttributesAction
{
    public function __construct(
        private readonly AttributeRepository $attributeRepository
    ) {}

    public function execute(string $generatorType): array
    {
        try {
            // Get attribute configuration for this generator type
            $attributeConfigs = DB::table('attribute_config')
                ->where('generator_type', $generatorType)
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();

            if ($attributeConfigs->isEmpty()) {
                return ['attributes' => []];
            }

            $result = [];

            foreach ($attributeConfigs as $config) {
                $category = $config->category;
                
                // Get attribute values for this category from the attributes table
                $attributes = DB::table('attributes')
                    ->where('category', $category)
                    ->orderBy('weight', 'desc')
                    ->orderBy('name')
                    ->get();
                
                if ($attributes->isEmpty()) {
                    continue;
                }

                // Convert to options format
                $options = [];
                foreach ($attributes as $attribute) {
                    // Use 'value' field if 'name' is null, fallback to 'name' for compatibility
                    $attributeValue = $attribute->value ?? $attribute->name;
                    if ($attributeValue) { // Skip null values
                        $options[] = [
                            'value' => $attributeValue,
                            'label' => $attribute->label ?? $attributeValue,
                            'weight' => $attribute->weight ?? 1
                        ];
                    }
                }

                // Sort by weight (descending) then by name
                usort($options, function($a, $b) {
                    if ($a['weight'] !== $b['weight']) {
                        return $b['weight'] <=> $a['weight'];
                    }
                    return $a['value'] <=> $b['value'];
                });

                $result[$category] = [
                    'label' => $config->label,
                    'type' => $config->input_type,
                    'options' => $options
                ];
            }

            return ['attributes' => $result];

        } catch (\Exception $e) {
            error_log("GetGeneratorAttributesAction error: " . $e->getMessage());
            throw new \Exception("Failed to get generator attributes: " . $e->getMessage());
        }
    }
}