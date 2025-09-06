<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use Illuminate\Database\Capsule\Manager as DB;

final class UpdateAttributeOptionAction
{
    public function execute(int $id, array $data): array
    {
        try {
            // Get the existing option
            $existing = DB::table('attributes')->where('id', $id)->first();
            
            if (!$existing) {
                throw new \InvalidArgumentException('Attribute option not found');
            }

            $name = trim($data['name'] ?? $existing->name);
            $value = trim($data['value'] ?? $existing->value ?? $name);
            $weight = intval($data['weight'] ?? $existing->weight ?? 1);

            if (empty($name)) {
                throw new \InvalidArgumentException('Name is required');
            }

            // Check if another option in the same category already has this name/value
            $duplicate = DB::table('attributes')
                ->where('category', $existing->category)
                ->where('id', '!=', $id)
                ->where(function($query) use ($name, $value) {
                    $query->where('name', $name)
                          ->orWhere('value', $value);
                })
                ->first();

            if ($duplicate) {
                throw new \InvalidArgumentException('Another option in this category already has this name or value');
            }

            // Update the option
            DB::table('attributes')
                ->where('id', $id)
                ->update([
                    'name' => $name,
                    'value' => $value,
                    'weight' => $weight,
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
            error_log("UpdateAttributeOptionAction error: " . $e->getMessage());
            throw new \Exception("Failed to update attribute option: " . $e->getMessage());
        }
    }
}