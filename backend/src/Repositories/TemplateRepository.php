<?php

namespace AnimePromptGen\Repositories;

use AnimePromptGen\Models\Template;
use Illuminate\Database\Eloquent\Collection;

class TemplateRepository
{
    /**
     * Get all templates with optional filters
     */
    public function getAll(array $filters = []): Collection
    {
        $query = Template::active();

        if (isset($filters['type'])) {
            $query->byType($filters['type']);
        }

        if (isset($filters['public_only']) && $filters['public_only']) {
            $query->public();
        }

        if (isset($filters['created_by'])) {
            $query->byCreator($filters['created_by']);
        }

        $orderBy = $filters['order_by'] ?? 'created_at';
        $orderDirection = $filters['order_direction'] ?? 'desc';

        return $query->orderBy($orderBy, $orderDirection)->get();
    }

    /**
     * Get template by ID
     */
    public function getById(int $id): ?Template
    {
        return Template::active()->find($id);
    }

    /**
     * Create new template
     */
    public function create(array $data): Template
    {
        return Template::create($data);
    }

    /**
     * Update template
     */
    public function update(int $id, array $data): ?Template
    {
        $template = $this->getById($id);
        if (!$template) {
            return null;
        }

        $template->update($data);
        return $template->fresh();
    }

    /**
     * Delete template (soft delete by setting is_active = false)
     */
    public function delete(int $id): bool
    {
        $template = $this->getById($id);
        if (!$template) {
            return false;
        }

        return $template->update(['is_active' => false]);
    }

    /**
     * Get popular templates
     */
    public function getPopular(?string $type = null, int $limit = 10): Collection
    {
        $query = Template::active()->orderBy('usage_count', 'desc');
        
        if ($type) {
            $query->byType($type);
        }

        return $query->limit($limit)->get();
    }

    /**
     * Get recent templates
     */
    public function getRecent(?string $type = null, int $limit = 10): Collection
    {
        $query = Template::active()->orderBy('created_at', 'desc');
        
        if ($type) {
            $query->byType($type);
        }

        return $query->limit($limit)->get();
    }

    /**
     * Get templates by creator
     */
    public function getByCreator(string $creator): Collection
    {
        return Template::active()->byCreator($creator)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get public templates
     */
    public function getPublic(?string $type = null): Collection
    {
        $query = Template::active()->public();
        
        if ($type) {
            $query->byType($type);
        }

        return $query->orderBy('usage_count', 'desc')->get();
    }

    /**
     * Increment template usage count
     */
    public function incrementUsage(int $id): bool
    {
        $template = $this->getById($id);
        if (!$template) {
            return false;
        }

        $template->incrementUsage();
        return true;
    }

    /**
     * Search templates by name or description
     */
    public function search(string $query, ?string $type = null): Collection
    {
        $searchQuery = Template::active()
            ->where(function($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%");
            });

        if ($type) {
            $searchQuery->byType($type);
        }

        return $searchQuery->orderBy('usage_count', 'desc')->get();
    }

    /**
     * Validate template data
     */
    public function validateTemplateData(array $data, string $type): array
    {
        $template = new Template(['type' => $type, 'template_data' => $data]);
        return $template->validateTemplateData();
    }

    /**
     * Clone a template (create a copy)
     */
    public function clone(int $id, string $newName, string $createdBy): ?Template
    {
        $original = $this->getById($id);
        if (!$original) {
            return null;
        }

        $cloneData = $original->toArray();
        unset($cloneData['id'], $cloneData['created_at'], $cloneData['updated_at']);
        
        $cloneData['name'] = $newName;
        $cloneData['created_by'] = $createdBy;
        $cloneData['is_public'] = false; // Clones are private by default
        $cloneData['usage_count'] = 0;

        return $this->create($cloneData);
    }
}