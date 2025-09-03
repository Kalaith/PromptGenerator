<?php

declare(strict_types=1);

namespace AnimePromptGen\External;

use AnimePromptGen\Models\DescriptionTemplate;
use Illuminate\Database\Eloquent\Collection;

final class DescriptionTemplateRepository
{
    public function findById(int $id): ?DescriptionTemplate
    {
        return DescriptionTemplate::find($id);
    }

    public function findByName(string $name): ?DescriptionTemplate
    {
        return DescriptionTemplate::where('name', $name)->first();
    }

    public function findByGeneratorType(string $generatorType): Collection
    {
        return DescriptionTemplate::active()
            ->byGeneratorType($generatorType)
            ->orderBy('name')
            ->get();
    }

    public function getDefaultByGeneratorType(string $generatorType): ?DescriptionTemplate
    {
        return DescriptionTemplate::active()
            ->byGeneratorType($generatorType)
            ->default()
            ->first();
    }

    public function getAllActive(): Collection
    {
        return DescriptionTemplate::active()
            ->orderBy('generator_type')
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): DescriptionTemplate
    {
        // If this is being set as default, unset other defaults for this generator type
        if ($data['is_default'] ?? false) {
            $this->unsetDefaultsForType($data['generator_type']);
        }

        $template = new DescriptionTemplate();
        $template->fill($data);
        $template->save();
        
        return $template;
    }

    public function update(DescriptionTemplate $template, array $data): DescriptionTemplate
    {
        // If this is being set as default, unset other defaults for this generator type
        if (($data['is_default'] ?? false) && $template->generator_type) {
            $this->unsetDefaultsForType($template->generator_type);
        }

        $template->fill($data);
        $template->save();
        
        return $template;
    }

    public function delete(DescriptionTemplate $template): bool
    {
        return $template->delete();
    }

    public function getGeneratorTypes(): array
    {
        return DescriptionTemplate::GENERATOR_TYPES;
    }

    /**
     * Bulk update templates for a generator type
     */
    public function bulkUpdateForType(string $generatorType, array $templates): array
    {
        $results = [];
        
        foreach ($templates as $templateData) {
            $templateData['generator_type'] = $generatorType;
            
            if (isset($templateData['id']) && $templateData['id']) {
                // Update existing template
                $template = $this->findById((int)$templateData['id']);
                if ($template) {
                    $results[] = $this->update($template, $templateData);
                }
            } else {
                // Create new template
                unset($templateData['id']);
                $results[] = $this->create($templateData);
            }
        }
        
        return $results;
    }

    /**
     * Get template statistics
     */
    public function getStatistics(): array
    {
        $stats = [];
        
        foreach (DescriptionTemplate::GENERATOR_TYPES as $type) {
            $stats[$type] = [
                'total' => DescriptionTemplate::byGeneratorType($type)->count(),
                'active' => DescriptionTemplate::active()->byGeneratorType($type)->count(),
                'has_default' => DescriptionTemplate::active()->byGeneratorType($type)->default()->exists()
            ];
        }
        
        return $stats;
    }

    /**
     * Unset default flag for all templates of a specific generator type
     */
    private function unsetDefaultsForType(string $generatorType): void
    {
        DescriptionTemplate::byGeneratorType($generatorType)
            ->where('is_default', true)
            ->update(['is_default' => false]);
    }

    /**
     * Validate template placeholders
     */
    public function validateTemplate(string $template, string $generatorType): array
    {
        $errors = [];
        $dummyTemplate = new DescriptionTemplate();
        $dummyTemplate->generator_type = $generatorType;
        
        $availablePlaceholders = $dummyTemplate->getAvailablePlaceholders();
        
        // Find all placeholders in template
        preg_match_all('/\{(\w+)\}/', $template, $matches);
        $usedPlaceholders = $matches[1];
        
        // Check for unknown placeholders
        foreach ($usedPlaceholders as $placeholder) {
            if (!in_array($placeholder, $availablePlaceholders)) {
                $errors[] = "Unknown placeholder: {{$placeholder}}";
            }
        }
        
        // Check template is not empty
        if (trim($template) === '') {
            $errors[] = "Template cannot be empty";
        }
        
        return $errors;
    }
}