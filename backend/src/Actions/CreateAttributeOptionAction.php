<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use Illuminate\Database\Capsule\Manager as DB;

final class CreateAttributeOptionAction
{
    public function execute(string $category, array $data): array
    {
        try {
            $name = trim($data['name'] ?? '');
            $value = trim($data['value'] ?? $name);
            $weight = intval($data['weight'] ?? 1);

            if (empty($name)) {
                throw new \InvalidArgumentException('Name is required');
            }

            // Check if option already exists in this category
            $existing = DB::table('attributes')
                ->where('category', $category)
                ->where(function($query) use ($name, $value) {
                    $query->where('name', $name)
                          ->orWhere('value', $value);
                })
                ->first();

            if ($existing) {
                throw new \InvalidArgumentException('Option with this name or value already exists in this category');
            }

            // Insert new option
            $id = DB::table('attributes')->insertGetId([
                'category' => $category,
                'name' => $name,
                'value' => $value,
                'weight' => $weight,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            return [
                'option' => [
                    'id' => $id,
                    'value' => $value,
                    'label' => $name,
                    'weight' => $weight
                ]
            ];

        } catch (\Exception $e) {
            error_log("CreateAttributeOptionAction error: " . $e->getMessage());
            throw new \Exception("Failed to create attribute option: " . $e->getMessage());
        }
    }
}