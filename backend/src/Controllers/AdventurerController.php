<?php

declare(strict_types=1);

namespace AnimePromptGen\Controllers;

use AnimePromptGen\Actions\GenerateAdventurerAction;
use AnimePromptGen\Services\AdventurerGenerationService;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

final class AdventurerController
{
    public function __construct(
        private readonly GenerateAdventurerAction $generateAdventurerAction,
        private readonly AdventurerGenerationService $adventurerService
    ) {}

    public function generate(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            
            $race = $data['race'] ?? null;
            $className = $data['class'] ?? null;
            $experience = $data['experience'] ?? null;
            $gender = $data['gender'] ?? null;
            $style = $data['style'] ?? null;
            $environment = $data['environment'] ?? null;
            $hairColor = $data['hairColor'] ?? null;
            $skinColor = $data['skinColor'] ?? null;
            $eyeColor = $data['eyeColor'] ?? null;
            $eyeStyle = $data['eyeStyle'] ?? null;
            $templateId = $data['templateId'] ?? null;

            $result = $this->generateAdventurerAction->execute(
                $race, $className, $experience, $gender, $style, $environment,
                $hairColor, $skinColor, $eyeColor, $eyeStyle, $templateId
            );
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    public function generateMultiple(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $data = json_decode($request->getBody()->getContents(), true);
            $count = (int)($data['count'] ?? 1);

            $result = $this->generateAdventurerAction->executeMultiple($count);
            
            $response->getBody()->write(json_encode([
                'success' => true,
                'data' => $result
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\InvalidArgumentException $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(400);

        } catch (\Exception $e) {
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Internal server error'
            ]));
            
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        }
    }

    /**
     * Get all available options for adventurer generation
     */
    public function getAvailableOptions(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        try {
            $options = [];
            $hasErrors = false;
            $errorMessages = [];

            // Get each option with individual error handling
            try {
                $races = $this->adventurerService->getAvailableRaces();
                $options['races'] = !empty($races) ? $races : [];
                if (empty($races)) {
                    $errorMessages[] = 'No race data available';
                }
            } catch (\Exception $e) {
                $options['races'] = [];
                $errorMessages[] = 'Failed to load races: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $classes = $this->adventurerService->getAvailableClasses();
                $options['classes'] = !empty($classes) ? $classes : [];
                if (empty($classes)) {
                    $errorMessages[] = 'No class data available';
                }
            } catch (\Exception $e) {
                $options['classes'] = [];
                $errorMessages[] = 'Failed to load classes: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $experienceLevels = $this->adventurerService->getAvailableExperienceLevels();
                $options['experienceLevels'] = !empty($experienceLevels) ? $experienceLevels : [];
                if (empty($experienceLevels)) {
                    $errorMessages[] = 'No experience level data available';
                }
            } catch (\Exception $e) {
                $options['experienceLevels'] = [];
                $errorMessages[] = 'Failed to load experience levels: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $genders = $this->adventurerService->getAvailableGenders();
                $options['genders'] = !empty($genders) ? $genders : [];
                if (empty($genders)) {
                    $errorMessages[] = 'No gender data available';
                }
            } catch (\Exception $e) {
                $options['genders'] = [];
                $errorMessages[] = 'Failed to load genders: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $artisticStyles = $this->adventurerService->getAvailableArtisticStyles();
                $options['artisticStyles'] = !empty($artisticStyles) ? $artisticStyles : [];
                if (empty($artisticStyles)) {
                    $errorMessages[] = 'No artistic style data available';
                }
            } catch (\Exception $e) {
                $options['artisticStyles'] = [];
                $errorMessages[] = 'Failed to load artistic styles: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $environments = $this->adventurerService->getAvailableEnvironments();
                $options['environments'] = !empty($environments) ? $environments : [];
                if (empty($environments)) {
                    $errorMessages[] = 'No environment data available';
                }
            } catch (\Exception $e) {
                $options['environments'] = [];
                $errorMessages[] = 'Failed to load environments: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $hairColors = $this->adventurerService->getAvailableHairColors();
                $options['hairColors'] = !empty($hairColors) ? $hairColors : [];
                if (empty($hairColors)) {
                    $errorMessages[] = 'No hair color data available';
                }
            } catch (\Exception $e) {
                $options['hairColors'] = [];
                $errorMessages[] = 'Failed to load hair colors: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $skinColors = $this->adventurerService->getAvailableSkinColors();
                $options['skinColors'] = !empty($skinColors) ? $skinColors : [];
                if (empty($skinColors)) {
                    $errorMessages[] = 'No skin color data available';
                }
            } catch (\Exception $e) {
                $options['skinColors'] = [];
                $errorMessages[] = 'Failed to load skin colors: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $eyeColors = $this->adventurerService->getAvailableEyeColors();
                $options['eyeColors'] = !empty($eyeColors) ? $eyeColors : [];
                if (empty($eyeColors)) {
                    $errorMessages[] = 'No eye color data available';
                }
            } catch (\Exception $e) {
                $options['eyeColors'] = [];
                $errorMessages[] = 'Failed to load eye colors: ' . $e->getMessage();
                $hasErrors = true;
            }

            try {
                $eyeStyles = $this->adventurerService->getAvailableEyeStyles();
                $options['eyeStyles'] = !empty($eyeStyles) ? $eyeStyles : [];
                if (empty($eyeStyles)) {
                    $errorMessages[] = 'No eye style data available';
                }
            } catch (\Exception $e) {
                $options['eyeStyles'] = [];
                $errorMessages[] = 'Failed to load eye styles: ' . $e->getMessage();
                $hasErrors = true;
            }

            // Always prepare success response with 200 status
            $responseData = [
                'success' => !$hasErrors,
                'data' => $options
            ];

            if (!empty($errorMessages)) {
                $responseData['warnings'] = $errorMessages;
                $responseData['message'] = 'Some data could not be loaded. See warnings for details.';
            }

            if ($hasErrors && empty(array_filter($options))) {
                $responseData['success'] = false;
                $responseData['message'] = 'Unable to load any adventurer options data.';
            }

            $response->getBody()->write(json_encode($responseData));
            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);

        } catch (\Exception $e) {
            // Even for fatal errors, return 200 with error in response body
            $response->getBody()->write(json_encode([
                'success' => false,
                'error' => 'Service temporarily unavailable: ' . $e->getMessage(),
                'message' => 'The adventurer options service is currently experiencing issues. Please try again later.',
                'data' => [
                    'races' => [],
                    'classes' => [],
                    'experienceLevels' => [],
                    'genders' => [],
                    'artisticStyles' => [],
                    'environments' => [],
                    'hairColors' => [],
                    'skinColors' => [],
                    'eyeColors' => [],
                    'eyeStyles' => []
                ]
            ]));

            return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
        }
    }
}
