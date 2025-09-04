<?php

declare(strict_types=1);

namespace AnimePromptGen\Actions;

use AnimePromptGen\External\AttributeRepository;

final class GetAnimeAttributesAction
{
    public function __construct(
        private readonly AttributeRepository $attributeRepository
    ) {}

    public function execute(): array
    {
        try {
            // Define which attribute categories are suitable for anime generation
            $animeCategories = [
                'hair_colors' => ['label' => 'Hair Color', 'type' => 'select'],
                'eye_colors' => ['label' => 'Eye Color', 'type' => 'select'],
                'hair_styles' => ['label' => 'Hair Style', 'type' => 'select'],
                'skin_colors' => ['label' => 'Skin Color', 'type' => 'select'],
                'eye_expressions' => ['label' => 'Eye Expression', 'type' => 'select'],
                'poses' => ['label' => 'Pose', 'type' => 'select'],
                'accessories' => ['label' => 'Accessory', 'type' => 'select'],
                'facial_features' => ['label' => 'Facial Features', 'type' => 'multi-select'],
                'gender' => ['label' => 'Gender', 'type' => 'select'],
                'artistic_style' => ['label' => 'Art Style', 'type' => 'select'],
                'environment' => ['label' => 'Environment', 'type' => 'select']
            ];

            $availableAttributes = [];
            
            foreach ($animeCategories as $category => $config) {
                $attributes = $this->attributeRepository->findByCategory($category);
                
                if ($attributes->isNotEmpty()) {
                    $availableAttributes[$category] = [
                        'label' => $config['label'],
                        'type' => $config['type'],
                        'options' => $attributes->map(function ($attr) {
                            return [
                                'value' => $attr->value ?? $attr->name,
                                'label' => $attr->name,
                                'weight' => $attr->weight ?? 1
                            ];
                        })->toArray()
                    ];
                }
            }

            return [
                'attributes' => $availableAttributes
            ];

        } catch (\Exception $e) {
            throw new \RuntimeException('Failed to get anime attributes: ' . $e->getMessage());
        }
    }
}