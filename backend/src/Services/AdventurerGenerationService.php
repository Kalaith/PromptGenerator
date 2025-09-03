<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\AdventurerClassRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\Models\AdventurerClass;

final class AdventurerGenerationService
{
    private const RACES = [
        'dragonkin', 'dwarf', 'elf', 'goblin', 'halfling', 'human', 'orc', 'tiefling',
        'half-elf', 'gnome', 'half-orc', 'aasimar', 'genasi', 'tabaxi', 'kenku', 'lizardfolk'
    ];

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
        private readonly AttributeRepository $attributeRepository,
        private readonly RandomGeneratorService $randomGenerator
    ) {}

    public function generateAdventurerPrompt(?string $race = null, ?string $className = null, ?string $experience = null): array
    {
        // Select random values if not provided
        $selectedRace = $race === 'random' || $race === null ? 
            $this->randomGenerator->getRandomElement(self::RACES) : $race;
        
        $adventurerClass = $this->getAdventurerClass($className);
        
        $selectedExperience = $experience ?? $this->randomGenerator->getRandomElement(self::EXPERIENCE_LEVELS);

        // Generate attributes
        $attributes = $this->generateAdventurerAttributes();

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
            'negative_prompt' => 'malformed anatomy, extra limbs, cartoon faces, low quality, blurry, modern clothing, sci-fi elements, realistic photography, 3D render',
            'tags' => [$selectedRace, $adventurerClass->name, $selectedExperience, $attributes['hairColor'], $attributes['eyeColor']]
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

    private function generateAdventurerAttributes(): array
    {
        return [
            'hairColor' => $this->randomGenerator->getRandomAttribute('hair_colors'),
            'hairStyle' => $this->randomGenerator->getRandomAttribute('hair_styles'),
            'eyeColor' => $this->randomGenerator->getRandomAttribute('eye_colors'),
            'eyeExpression' => $this->randomGenerator->getRandomAttribute('eye_expressions'),
            'background' => $this->randomGenerator->getRandomAttribute('backgrounds'),
            'pose' => $this->randomGenerator->getRandomAttribute('poses'),
            'facialFeatures' => $this->randomGenerator->getRandomAttributes('facial_features', $this->randomGenerator->generateRandomInt(1, 3))
        ];
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
        return empty($selectedFeatures) ? '' : 'She has distinctive ' . implode(' and ', $selectedFeatures) . '.';
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

        $template = "An anime-style portrait of a {experience}-level {race} {class} with {hairColor} {hairStyle} hair and {eyeColor} eyes. {raceFeatures} She wears {equipment} and has {facialFeatures}, {pose} against a {background}.";

        return str_replace([
            '{experience}',
            '{race}',
            '{class}',
            '{hairColor}',
            '{hairStyle}',
            '{eyeColor}',
            '{raceFeatures}',
            '{equipment}',
            '{facialFeatures}',
            '{pose}',
            '{background}'
        ], [
            $experience,
            $race,
            $class->name,
            $attributes['hairColor'] ?? '',
            $attributes['hairStyle'] ?? '',
            $attributes['eyeColor'] ?? '',
            $raceFeatures,
            $equipmentText,
            $facialFeaturesText,
            $attributes['pose'] ?? '',
            $attributes['background'] ?? ''
        ], $template);
    }
}
