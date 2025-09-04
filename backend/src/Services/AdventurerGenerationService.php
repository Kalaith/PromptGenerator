<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\AdventurerClassRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\External\UnifiedSpeciesRepository;
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
        private readonly UnifiedSpeciesRepository $speciesRepository,
        AttributeRepository $attributeRepository,
        RandomGeneratorService $randomGenerator,
        DescriptionTemplateRepository $templateRepository
    ) {
        parent::__construct($attributeRepository, $randomGenerator, $templateRepository);
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
        // Get races from unified species (type 'race' and 'fantasy')
        $races = $this->speciesRepository->findByType('race');
        $fantasyRaces = $this->speciesRepository->findByType('fantasy');
        
        $allRaces = $races->merge($fantasyRaces);
        $raceNames = $allRaces->pluck('name')->toArray();
        
        // Add predefined fantasy races if not in database
        $predefinedRaces = ['human', 'elf', 'dwarf', 'halfling', 'dragonborn', 'tiefling', 'gnome', 'half-elf', 'orc'];
        
        return array_unique(array_merge($raceNames, $predefinedRaces));
    }

    public function getAvailableExperienceLevels(): array
    {
        $levels = $this->attributeRepository->getAttributeValues('experience_levels');
        return !empty($levels) ? $levels : ['novice', 'experienced', 'veteran', 'legendary'];
    }

    public function getAvailableClasses(): array
    {
        $classes = $this->classRepository->getAllActive();
        return $classes->pluck('name')->toArray();
    }

    public function getAvailableGenders(): array
    {
        $genders = $this->attributeRepository->getAttributeValues('gender');
        return !empty($genders) ? $genders : ['female', 'male', 'non-binary'];
    }

    public function getAvailableArtisticStyles(): array
    {
        $styles = $this->attributeRepository->getAttributeValues('artistic_style');
        return !empty($styles) ? $styles : ['anime', 'realistic', 'fantasy', 'manga'];
    }

    public function getAvailableEnvironments(): array
    {
        $environments = $this->attributeRepository->getAttributeValues('environment');
        return !empty($environments) ? $environments : ['tavern', 'forest', 'castle', 'dungeon', 'city'];
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
        $levels = $this->getAvailableExperienceLevels();
        return $this->randomGenerator->getRandomElement($levels);
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

        $template = $this->getTemplate('adventurer', null);

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
