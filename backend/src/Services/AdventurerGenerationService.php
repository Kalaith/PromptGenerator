<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\AdventurerClassRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\External\GameAssetRepository;
use AnimePromptGen\External\SpeciesRepository;
use AnimePromptGen\External\DescriptionTemplateRepository;
use AnimePromptGen\Models\AdventurerClass;

final class AdventurerGenerationService extends BaseGenerationService
{
    private const EXPERIENCE_LEVELS = ['low', 'mid', 'high'];

    private const RACE_TRAITS = [
        'dragonkin' => [
            'features' => ['dragon scales', 'draconic eyes', 'small horns', 'elongated canines', 'claw-like nails'],
            'colorVariants' => ['crimson', 'golden', 'emerald', 'sapphire', 'obsidian', 'silver']
        ],
        'dwarf' => [
            'features' => ['braided beard', 'stocky build', 'calloused hands', 'determined expression'],
            'specialties' => ['smithing', 'mining', 'brewing', 'stonework']
        ],
        'elf' => [
            'features' => ['pointed ears', 'graceful posture', 'ethereal beauty', 'piercing gaze'],
            'subtypes' => ['high elf', 'wood elf', 'dark elf', 'sea elf']
        ],
        'tiefling' => [
            'features' => ['small horns', 'pointed tail', 'fanged teeth', 'infernal markings'],
            'hornStyles' => ['curved', 'straight', 'spiral', 'branched']
        ],
        'orc' => [
            'features' => ['prominent tusks', 'muscular build', 'tribal scars', 'fierce expression'],
            'warPaint' => ['red stripes', 'black dots', 'white symbols', 'blue spirals']
        ]
    ];

    public function __construct(
        private readonly AdventurerClassRepository $classRepository,
        private readonly SpeciesRepository $speciesRepository,
        AttributeRepository $attributeRepository,
        GameAssetRepository $gameAssetRepository,
        RandomGeneratorService $randomGenerator,
        DescriptionTemplateRepository $templateRepository
    ) {
        parent::__construct($attributeRepository, $gameAssetRepository, $randomGenerator, $templateRepository);
    }

    public function generatePromptData(...$args): array
    {
        // Extract parameters with defaults
        $race = $args[0] ?? null;
        $className = $args[1] ?? null;
        $experience = $args[2] ?? null;
        $gender = $args[3] ?? null;
        $style = $args[4] ?? null;
        $environment = $args[5] ?? null;
        $hairColor = $args[6] ?? null;
        $skinColor = $args[7] ?? null;
        $eyeColor = $args[8] ?? null;
        $eyeStyle = $args[9] ?? null;
        $templateId = $args[10] ?? null;

        // Select random values if not provided
        $selectedRace = $race === 'random' || $race === null ? 
            $this->getRandomRace() : $race;
        
        $adventurerClass = $this->getAdventurerClass($className);
        
        $selectedExperience = $experience ?? $this->getRandomExperienceLevel();

        // Generate attributes with all options
        $attributes = $this->generateExtendedAttributes($gender, $style, $environment, $hairColor, $skinColor, $eyeColor, $eyeStyle);

        // Generate equipment based on class and experience
        $equipment = $this->generateEquipment($adventurerClass, $selectedExperience);

        // Generate race-specific features
        $raceFeatures = $this->generateRaceFeatures($selectedRace);

        // Generate description
        $description = $this->generateAdventurerDescription(
            $selectedRace, 
            $adventurerClass, 
            $selectedExperience, 
            $attributes, 
            $equipment, 
            $raceFeatures
        );

        return [
            'race' => $selectedRace,
            'class' => $adventurerClass->name,
            'experience' => $selectedExperience,
            'attributes' => $attributes,
            'equipment' => $equipment,
            'raceFeatures' => $raceFeatures,
            'description' => $description,
            'negative_prompt' => $this->generateStandardNegativePrompt(),
            'tags' => $this->generateBaseTags($attributes, [$selectedRace, $adventurerClass->name, $selectedExperience])
        ];
    }

    private function getAdventurerClass(?string $className): AdventurerClass
    {
        if ($className && $className !== 'random') {
            $class = $this->classRepository->findByName($className);
            if ($class) {
                return $class;
            }
        }

        $randomClass = $this->classRepository->getRandomActive();
        if (!$randomClass) {
            throw new \RuntimeException('No adventurer classes available');
        }

        return $randomClass;
    }

    public function getAvailableRaces(): array
    {
        // Get traditional fantasy races from database
        $races = $this->gameAssetRepository->getByType('race');
        $raceNames = array_map(fn($race) => $race->name, $races);
        
        // Add anime species as race options
        $animeSpecies = $this->speciesRepository->getAllActive();
        $speciesNames = $animeSpecies->pluck('name')->toArray();
        
        return array_merge($raceNames, $speciesNames);
    }

    public function getAvailableExperienceLevels(): array
    {
        $levels = $this->gameAssetRepository->getByType('experience_level');
        return array_map(fn($level) => $level->name, $levels);
    }

    public function getAvailableClasses(): array
    {
        $classes = $this->classRepository->getAllActive();
        return $classes->pluck('name')->toArray();
    }

    public function getAvailableGenders(): array
    {
        $genders = $this->gameAssetRepository->getByType('gender');
        return array_map(fn($gender) => $gender->name, $genders);
    }

    public function getAvailableArtisticStyles(): array
    {
        $styles = $this->gameAssetRepository->getByType('artistic_style');
        return array_map(fn($style) => $style->name, $styles);
    }

    public function getAvailableEnvironments(): array
    {
        $environments = $this->gameAssetRepository->getByType('environment');
        return array_map(fn($environment) => $environment->name, $environments);
    }

    public function getAvailableHairColors(): array
    {
        return $this->attributeRepository->getAttributeValues('hair_colors') ?? [];
    }

    public function getAvailableSkinColors(): array
    {
        return $this->attributeRepository->getAttributeValues('skin_colors') ?? [];
    }

    public function getAvailableEyeColors(): array
    {
        return $this->attributeRepository->getAttributeValues('eye_colors') ?? [];
    }

    public function getAvailableEyeStyles(): array
    {
        return $this->attributeRepository->getAttributeValues('eye_expressions') ?? [];
    }

    private function getRandomRace(): string
    {
        $availableRaces = $this->getAvailableRaces();
        return $this->randomGenerator->getRandomElement($availableRaces) ?? 'human';
    }

    private function getRandomExperienceLevel(): string
    {
        $level = $this->gameAssetRepository->getRandomByType('experience_level');
        return $level ? $level->name : 'low';
    }

    private function generateEquipment(AdventurerClass $class, string $experience): array
    {
        $equipmentConfig = $class->equipment_config ?? [];
        $experienceConfig = $equipmentConfig[$experience] ?? [];

        if (empty($experienceConfig)) {
            return [];
        }

        return [
            'armor' => $this->randomGenerator->getRandomElement($experienceConfig['armor'] ?? []),
            'weapon' => $this->randomGenerator->getRandomElement($experienceConfig['weapons'] ?? []),
            'accessory' => $this->randomGenerator->getRandomElement($experienceConfig['accessories'] ?? [])
        ];
    }

    private function generateRaceFeatures(string $race): string
    {
        $traits = self::RACE_TRAITS[$race] ?? null;
        if (!$traits || empty($traits['features'])) {
            return '';
        }

        $selectedFeatures = $this->randomGenerator->getRandomElements($traits['features'], $this->randomGenerator->generateRandomInt(1, 2));
        return empty($selectedFeatures) ? '' : 'They have distinctive ' . implode(' and ', $selectedFeatures) . '.';
    }

    private function generateAdventurerDescription(
        string $race, 
        AdventurerClass $class, 
        string $experience, 
        array $attributes, 
        array $equipment, 
        string $raceFeatures
    ): string {
        $equipmentText = implode(', ', array_filter($equipment));
        $facialFeaturesText = implode(', ', $attributes['facialFeatures'] ?? []);

        $template = $this->getTemplate('adventurer', $templateId);

        $replacements = array_merge($attributes, [
            'experience' => $experience,
            'race' => $race,
            'class' => $class->name,
            'raceFeatures' => $raceFeatures,
            'equipment' => $equipmentText,
            'facialFeatures' => $facialFeaturesText,
        ]);

        return $this->processTemplate($template, $replacements);
    }
}
