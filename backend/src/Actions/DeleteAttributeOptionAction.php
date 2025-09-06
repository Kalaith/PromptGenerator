<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use Illuminate\Database\Capsule\Manager as DB;

final class DeleteAttributeOptionAction
{
    public function execute(int $id): array
    {
        try {
            // Get the existing option
            $existing = DB::table('attributes')->where('id', $id)->first();
            
            if (!$existing) {
                throw new \InvalidArgumentException('Attribute option not found');
            }

            // Delete the option
            $deleted = DB::table('attributes')
                ->where('id', $id)
                ->delete();

            if (!$deleted) {
                throw new \Exception('Failed to delete attribute option');
            }

            return [
                'deleted_id' => $id,
                'deleted_option' => [
                    'id' => $id,
                    'value' => $existing->value ?? $existing->name,
                    'label' => $existing->name,
                    'category' => $existing->category
                ]
            ];

        } catch (\Exception $e) {
            error_log("DeleteAttributeOptionAction error: " . $e->getMessage());
            throw new \Exception("Failed to delete attribute option: " . $e->getMessage());
        }
    }
}