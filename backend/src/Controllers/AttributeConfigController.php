<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Illuminate\Database\Capsule\Manager as DB;

final class AttributeConfigController
{
    public function getConfigs(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $configs = DB::table('attribute_config')
                ->orderBy('generator_type')
                ->orderBy('sort_order')
                ->get();

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $configs
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function updateConfig(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $id = (int) $args['id'];
            $data = json_decode((string) $request->getBody(), true);

            if (!$data) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON data'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $updateData = [];
            
            if (isset($data['label'])) {
                $updateData['label'] = $data['label'];
            }
            if (isset($data['input_type'])) {
                $updateData['input_type'] = $data['input_type'];
            }
            if (isset($data['is_active'])) {
                $updateData['is_active'] = (bool) $data['is_active'];
            }
            if (isset($data['sort_order'])) {
                $updateData['sort_order'] = (int) $data['sort_order'];
            }

            if (empty($updateData)) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'No valid fields to update'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $updateData['updated_at'] = date('Y-m-d H:i:s');

            $affected = DB::table('attribute_config')
                ->where('id', $id)
                ->update($updateData);

            if ($affected === 0) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Configuration not found'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(404);
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Configuration updated successfully'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function createConfig(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode((string) $request->getBody(), true);

            if (!$data || !isset($data['generator_type'], $data['category'], $data['label'])) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Missing required fields: generator_type, category, label'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(400);
            }

            $insertData = [
                'generator_type' => $data['generator_type'],
                'category' => $data['category'],
                'label' => $data['label'],
                'input_type' => $data['input_type'] ?? 'select',
                'is_active' => $data['is_active'] ?? true,
                'sort_order' => $data['sort_order'] ?? 0,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $id = DB::table('attribute_config')->insertGetId($insertData);

            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => ['id' => $id],
                'message' => 'Configuration created successfully'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }

    public function deleteConfig(ServerRequestInterface $request, ResponseInterface $response, array $args): ResponseInterface
    {
        try {
            $id = (int) $args['id'];

            $affected = DB::table('attribute_config')
                ->where('id', $id)
                ->delete();

            if ($affected === 0) {
                $response->getBody()->write(json_encode([
                    'success' => false,
                    'error' => 'Configuration not found'
                ]));
                
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(404);
            }

            $response->getBody()->write(json_encode([
                'success' => true,
                'message' => 'Configuration deleted successfully'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json');
            
        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(500);
        }
    }
}