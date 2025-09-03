<?php

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Repositories\TemplateRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class TemplateController
{
    private TemplateRepository $templateRepository;

    public function __construct()
    {
        $this->templateRepository = new TemplateRepository();
    }

    /**
     * GET /api/v1/templates
     * Get all templates with optional filters
     */
    public function getAll(Request $request, Response $response): Response
    {
        try {
            $params = $request->getQueryParams();
            
            $filters = [
                'type' => $params['type'] ?? null,
                'public_only' => isset($params['public_only']) && $params['public_only'] === 'true',
                'created_by' => $params['created_by'] ?? null,
                'order_by' => $params['order_by'] ?? 'created_at',
                'order_direction' => $params['order_direction'] ?? 'desc'
            ];

            $templates = $this->templateRepository->getAll($filters);

            $response->getBody()->write(json_encode([
                'success' => true,
                'templates' => $templates->toArray()
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to fetch templates: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * GET /api/v1/templates/{id}
     * Get template by ID
     */
    public function getById(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int)$args['id'];
            $template = $this->templateRepository->getById($id);

            if (!$template) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'template' => $template->toArray()
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to fetch template: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * POST /api/v1/templates
     * Create new template
     */
    public function create(Request $request, Response $response): Response
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);

            if (!$data) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON data'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Validate required fields
            $requiredFields = ['name', 'type', 'template_data'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    $response->getBody()->write(json_encode([
                        'success' => false,
                        'error' => "Required field missing: {$field}"
                    ]));
                    return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
                }
            }

            // Validate template data structure
            $errors = $this->templateRepository->validateTemplateData($data['template_data'], $data['type']);
            if (!empty($errors)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template data validation failed',
                    'validation_errors' => $errors
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $template = $this->templateRepository->create($data);

            $response->getBody()->write(json_encode([
                'success' => true,
                'template' => $template->toArray()
            ]));

            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to create template: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * PUT /api/v1/templates/{id}
     * Update template
     */
    public function update(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int)$args['id'];
            $data = json_decode($request->getBody()->getContents(), true);

            if (!$data) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON data'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            // Validate template data if provided
            if (isset($data['template_data']) && isset($data['type'])) {
                $errors = $this->templateRepository->validateTemplateData($data['template_data'], $data['type']);
                if (!empty($errors)) {
                    $response->getBody()->write(json_encode([
                        'success' => false,
                        'error' => 'Template data validation failed',
                        'validation_errors' => $errors
                    ]));
                    return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
                }
            }

            $template = $this->templateRepository->update($id, $data);

            if (!$template) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'template' => $template->toArray()
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to update template: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * DELETE /api/v1/templates/{id}
     * Delete template (soft delete)
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int)$args['id'];
            $success = $this->templateRepository->delete($id);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Template deleted successfully'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to delete template: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * GET /api/v1/templates/popular
     * Get popular templates
     */
    public function getPopular(Request $request, Response $response): Response
    {
        try {
            $params = $request->getQueryParams();
            $type = $params['type'] ?? null;
            $limit = (int)($params['limit'] ?? 10);

            $templates = $this->templateRepository->getPopular($type, $limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'templates' => $templates->toArray()
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to fetch popular templates: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * GET /api/v1/templates/recent
     * Get recent templates
     */
    public function getRecent(Request $request, Response $response): Response
    {
        try {
            $params = $request->getQueryParams();
            $type = $params['type'] ?? null;
            $limit = (int)($params['limit'] ?? 10);

            $templates = $this->templateRepository->getRecent($type, $limit);

            $response->getBody()->write(json_encode([
                'success' => true,
                'templates' => $templates->toArray()
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to fetch recent templates: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * POST /api/v1/templates/{id}/use
     * Increment usage count for template
     */
    public function incrementUsage(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int)$args['id'];
            $success = $this->templateRepository->incrementUsage($id);

            if (!$success) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template not found'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Usage count updated'
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to update usage count: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * GET /api/v1/templates/search
     * Search templates
     */
    public function search(Request $request, Response $response): Response
    {
        try {
            $params = $request->getQueryParams();
            $query = $params['q'] ?? '';
            $type = $params['type'] ?? null;

            if (empty($query)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Search query is required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $templates = $this->templateRepository->search($query, $type);

            $response->getBody()->write(json_encode([
                'success' => true,
                'templates' => $templates->toArray()
            ]));

            return $response->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to search templates: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }

    /**
     * POST /api/v1/templates/{id}/clone
     * Clone a template
     */
    public function clone(Request $request, Response $response, array $args): Response
    {
        try {
            $id = (int)$args['id'];
            $data = json_decode($request->getBody()->getContents(), true);

            $newName = $data['name'] ?? null;
            $createdBy = $data['created_by'] ?? 'anonymous';

            if (!$newName) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'New template name is required'
                ]));
                return $response->withStatus(400)->withHeader('Content-Type', 'application/json');
            }

            $clonedTemplate = $this->templateRepository->clone($id, $newName, $createdBy);

            if (!$clonedTemplate) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template not found or could not be cloned'
                ]));
                return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'template' => $clonedTemplate->toArray()
            ]));

            return $response->withStatus(201)->withHeader('Content-Type', 'application/json');
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to clone template: ' . $e->getMessage()
            ]));
            return $response->withStatus(500)->withHeader('Content-Type', 'application/json');
        }
    }
}