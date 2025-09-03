<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\External\DescriptionTemplateRepository;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class DescriptionTemplateController
{
    public function __construct(
        private readonly DescriptionTemplateRepository $templateRepository
    ) {}

    /**
     * GET /api/description-templates
     * Get all templates, optionally filtered by generator type
     */
    public function getTemplates(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $generatorType = $params['generator_type'] ?? null;

        try {
            if ($generatorType) {
                $templates = $this->templateRepository->findByGeneratorType($generatorType);
            } else {
                $templates = $this->templateRepository->getAllActive();
            }

            $templatesData = $templates->map(function ($template) {
                return [
                    'id' => $template->id,
                    'name' => $template->name,
                    'generator_type' => $template->generator_type,
                    'template' => $template->template,
                    'description' => $template->description,
                    'is_active' => $template->is_active,
                    'is_default' => $template->is_default,
                    'available_placeholders' => $template->getAvailablePlaceholders(),
                    'preview' => $template->preview(),
                    'created_at' => $template->created_at,
                    'updated_at' => $template->updated_at
                ];
            });

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $templatesData
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve templates',
                'message' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * GET /api/description-templates/{id}
     * Get a specific template
     */
    public function getTemplate(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];

        try {
            $template = $this->templateRepository->findById($id);
            
            if (!$template) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $templateData = [
                'id' => $template->id,
                'name' => $template->name,
                'generator_type' => $template->generator_type,
                'template' => $template->template,
                'description' => $template->description,
                'is_active' => $template->is_active,
                'is_default' => $template->is_default,
                'available_placeholders' => $template->getAvailablePlaceholders(),
                'preview' => $template->preview(),
                'created_at' => $template->created_at,
                'updated_at' => $template->updated_at
            ];

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $templateData
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve template',
                'message' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * POST /api/description-templates
     * Create a new template
     */
    public function createTemplate(Request $request, Response $response): Response
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON data'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            // Validate required fields
            $requiredFields = ['name', 'generator_type', 'template'];
            $missingFields = [];
            
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || trim($data[$field]) === '') {
                    $missingFields[] = $field;
                }
            }
            
            if (!empty($missingFields)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Missing required fields',
                    'missing_fields' => $missingFields
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            // Validate template
            $validationErrors = $this->templateRepository->validateTemplate($data['template'], $data['generator_type']);
            if (!empty($validationErrors)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template validation failed',
                    'validation_errors' => $validationErrors
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $template = $this->templateRepository->create($data);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'id' => $template->id,
                    'name' => $template->name,
                    'generator_type' => $template->generator_type,
                    'template' => $template->template,
                    'description' => $template->description,
                    'is_active' => $template->is_active,
                    'is_default' => $template->is_default
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(201);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to create template',
                'message' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * PUT /api/description-templates/{id}
     * Update a template
     */
    public function updateTemplate(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];

        try {
            $template = $this->templateRepository->findById($id);
            
            if (!$template) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON data'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            // Validate template if it's being updated
            if (isset($data['template']) && isset($data['generator_type'])) {
                $validationErrors = $this->templateRepository->validateTemplate($data['template'], $data['generator_type']);
                if (!empty($validationErrors)) {
                    $response->getBody()->write(json_encode([
                        'success' => false,
                        'error' => 'Template validation failed',
                        'validation_errors' => $validationErrors
                    ]));
                    return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
                }
            }

            $updatedTemplate = $this->templateRepository->update($template, $data);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'id' => $updatedTemplate->id,
                    'name' => $updatedTemplate->name,
                    'generator_type' => $updatedTemplate->generator_type,
                    'template' => $updatedTemplate->template,
                    'description' => $updatedTemplate->description,
                    'is_active' => $updatedTemplate->is_active,
                    'is_default' => $updatedTemplate->is_default
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to update template',
                'message' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * DELETE /api/description-templates/{id}
     * Delete a template
     */
    public function deleteTemplate(Request $request, Response $response, array $args): Response
    {
        $id = (int) $args['id'];

        try {
            $template = $this->templateRepository->findById($id);
            
            if (!$template) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Template not found'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(404);
            }

            // Don't allow deleting default templates
            if ($template->is_default) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Cannot delete default template'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $this->templateRepository->delete($template);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Template deleted successfully'
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to delete template',
                'message' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * POST /api/description-templates/bulk/{generator_type}
     * Bulk update templates for a generator type
     */
    public function bulkUpdateTemplates(Request $request, Response $response, array $args): Response
    {
        $generatorType = $args['generator_type'];

        try {
            $data = json_decode($request->getBody()->getContents(), true);
            
            if (!$data || !isset($data['templates']) || !is_array($data['templates'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid data format. Expected {"templates": [...]}.'
                ]));
                return $response->withHeader('Content-Type', 'application/json')->withStatus(400);
            }

            $results = $this->templateRepository->bulkUpdateForType($generatorType, $data['templates']);

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Templates updated successfully',
                'updated_count' => count($results)
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to bulk update templates',
                'message' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * GET /api/description-templates/generator-types
     * Get available generator types and their statistics
     */
    public function getGeneratorTypes(Request $request, Response $response): Response
    {
        try {
            $types = $this->templateRepository->getGeneratorTypes();
            $stats = $this->templateRepository->getStatistics();

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => [
                    'generator_types' => $types,
                    'statistics' => $stats
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json');

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Failed to retrieve generator types',
                'message' => $e->getMessage()
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }
}