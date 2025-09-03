<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\AlienSpeciesRepository;
use AnimePromptGen\External\AlienTraitRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\Models\AlienSpecies;
use AnimePromptGen\Models\AlienTrait;

final class AlienGenerationService
{
    private const CLIMATES = [
        'wet' => ['Continental', 'Ocean', 'Tropical'],
        'dry' => ['Savanna', 'Alpine', 'Steppe'],
        'cold' => ['Desert', 'Tundra', 'Arctic']
    ];

    private const GENDERS = ['male', 'female'];

    private const ARTISTIC_STYLES = [
        'cyberpunk', 'fantasy', 'realistic', 'surreal', 'biomechanical', 
        'retro-futuristic', 'minimalist', 'baroque'
    ];

    private const ENVIRONMENTS = [
        'futuristic cityscape', 'alien jungle', 'desolate wasteland', 'underwater city', 
        'orbital space station', 'volcanic landscape', 'crystalline cavern', 'floating sky islands', 
        'toxic swamp', 'ancient ruins'
    ];

    private const CULTURAL_ARTIFACTS = [
        'ceremonial staff', 'holographic data slate', 'glowing amulet', 'intricate blade', 
        'tribal mask', 'bioluminescent orb', 'ancient relic', 'futuristic headset', 
        'ornate scepter', 'mechanical prosthetic'
    ];

    public function __construct(
        private readonly AlienSpeciesRepository $alienSpeciesRepository,
        private readonly AlienTraitRepository $alienTraitRepository,
        private readonly AttributeRepository $attributeRepository,
        private readonly RandomGeneratorService $randomGenerator
    ) {}

    public function generateAlienPromptData(
        ?string $speciesClass = null,
        ?string $climate = null,
        ?string $positiveTrait = null,
        ?string $negativeTrait = null,
        ?string $style = null,
        ?string $environment = null,
        ?string $gender = null
    ): array {
        // Handle random species class
        $actualClass = $speciesClass;
        if ($speciesClass === 'random' || $speciesClass === null) {
            $availableClasses = $this->alienSpeciesRepository->getAllClasses();
            $actualClass = $this->randomGenerator->getRandomElement($availableClasses);
        }

        // Get species data
        $species = $this->getSpeciesForGeneration($actualClass);
        if (!$species) {
            throw new \InvalidArgumentException("No species found for class: {$actualClass}");
        }

        // Generate climate
        $selectedClimate = $climate ?? $this->generateRandomClimate();

        // Generate gender
        $selectedGender = $gender ?? $this->randomGenerator->getRandomElement(self::GENDERS);

        // Generate traits
        $positiveTrait = $this->getTraitForGeneration('positive', $positiveTrait);
        $negativeTrait = $this->getTraitForGeneration('negative', $negativeTrait);

        // Generate artistic style
        $selectedStyle = $style ?? $this->randomGenerator->getRandomElement(self::ARTISTIC_STYLES);

        // Generate environment
        $selectedEnvironment = $environment ?? $this->randomGenerator->getRandomElement(self::ENVIRONMENTS);

        // Generate cultural artifact
        $selectedArtifact = $this->randomGenerator->getRandomElement(self::CULTURAL_ARTIFACTS);

        // Generate physical attributes adapted to species
        $attributes = $this->generateAlienAttributes($actualClass);

        // Generate description
        $description = $this->generateAlienDescription(
            $species, 
            $selectedGender, 
            $selectedClimate, 
            $selectedStyle, 
            $positiveTrait, 
            $negativeTrait, 
            $selectedEnvironment, 
            $selectedArtifact, 
            $attributes
        );

        return [
            'species' => $species,
            'gender' => $selectedGender,
            'climate' => $selectedClimate,
            'positive_trait' => $positiveTrait,
            'negative_trait' => $negativeTrait,
            'style' => $selectedStyle,
            'environment' => $selectedEnvironment,
            'artifact' => $selectedArtifact,
            'attributes' => $attributes,
            'description' => $description,
            'negative_prompt' => $this->generateAlienNegativePrompt(),
            'tags' => $this->generateAlienTags(
                $actualClass, 
                $selectedClimate, 
                $positiveTrait, 
                $negativeTrait, 
                $selectedStyle, 
                $selectedEnvironment, 
                $selectedArtifact, 
                $selectedGender, 
                $attributes
            )
        ];
    }

    private function getSpeciesForGeneration(?string $class): ?AlienSpecies
    {
        if (!$class) {
            $availableClasses = $this->alienSpeciesRepository->getAllClasses();
            $class = $this->randomGenerator->getRandomElement($availableClasses);
        }

        return $this->alienSpeciesRepository->getRandomByClass($class);
    }

    private function getTraitForGeneration(string $type, ?string $traitName): ?AlienTrait
    {
        if ($traitName && $traitName !== 'random') {
            $trait = $this->alienTraitRepository->findByName($traitName);
            if ($trait && $trait->type === $type) {
                return $trait;
            }
        }

        return $this->alienTraitRepository->getRandomByType($type);
    }

    private function generateRandomClimate(): string
    {
        $climateType = $this->randomGenerator->getRandomElement(array_keys(self::CLIMATES));
        return $this->randomGenerator->getRandomElement(self::CLIMATES[$climateType]);
    }

    private function generateAlienAttributes(string $speciesClass): array
    {
        // Adapt attributes based on species type
        $attributes = [];

        if (in_array($speciesClass, ['Humanoid', 'Mammalian', 'Necroid'])) {
            // Species that can have traditional hair
            $attributes['hairColor'] = $this->randomGenerator->getRandomAttribute('hair_colors') ?? 'natural';
            $attributes['hairStyle'] = $this->randomGenerator->getRandomAttribute('hair_styles') ?? 'standard';
        } elseif ($speciesClass === 'Avian') {
            // Feathered species - adapt hair to feathers
            $attributes['hairColor'] = $this->randomGenerator->getRandomAttribute('hair_colors') ?? 'natural';
            $attributes['hairStyle'] = 'feathered crest';
        } elseif ($speciesClass === 'Plantoid') {
            // Plant species - adapt to leaves/petals
            $attributes['hairColor'] = $this->randomGenerator->getRandomElement(['green', 'brown', 'yellow', 'red', 'orange']) ?? 'green';
            $attributes['hairStyle'] = 'leaf-like fronds';
        } elseif ($speciesClass === 'Machine') {
            // Mechanical species - no traditional hair
            $attributes['hairColor'] = 'metallic';
            $attributes['hairStyle'] = 'synthetic fibers';
        } else {
            // Other species - more exotic options
            $attributes['hairColor'] = $this->randomGenerator->getRandomElement(['iridescent', 'bioluminescent', 'crystalline', 'ethereal']) ?? 'iridescent';
            $attributes['hairStyle'] = 'alien appendages';
        }

        $attributes['eyeColor'] = $this->randomGenerator->getRandomAttribute('eye_colors') ?? 'brown';
        $attributes['clothing'] = $this->randomGenerator->getRandomAttribute('clothing_items') ?? 'standard clothing';
        $attributes['accessory'] = $this->randomGenerator->shouldRandomlyOccur(0.5) 
            ? $this->randomGenerator->getRandomAttribute('accessories') 
            : 'none';
        $attributes['facialFeature'] = $this->randomGenerator->getRandomAttribute('facial_features') ?? 'neutral expression';
        $attributes['pose'] = $this->randomGenerator->getRandomAttribute('poses') ?? 'stands';
        $attributes['eyeExpression'] = $this->randomGenerator->getRandomAttribute('eye_expressions') ?? 'neutral gaze';
        $attributes['background'] = $this->randomGenerator->getRandomAttribute('backgrounds') ?? 'neutral background';

        return $attributes;
    }

    private function generateAlienDescription(
        AlienSpecies $species,
        string $gender,
        string $climate,
        string $style,
        ?AlienTrait $positiveTrait,
        ?AlienTrait $negativeTrait,
        string $environment,
        string $artifact,
        array $attributes
    ): string {
        // Get visual details from species
        $visualDetails = $species->visual_descriptors 
            ? $this->randomGenerator->getRandomElements($species->visual_descriptors, 2) 
            : [];
        
        $variation = $species->variations && count($species->variations) > 0
            ? $this->randomGenerator->getRandomElement($species->variations) ?? 'standard'
            : 'standard';

        // Get trait visuals
        $posTraitVisual = $positiveTrait && $positiveTrait->visual_descriptors
            ? $this->randomGenerator->getRandomElement($positiveTrait->visual_descriptors) ?? 'with a confident bearing'
            : 'with a confident bearing';

        $negTraitVisual = $negativeTrait && $negativeTrait->visual_descriptors
            ? $this->randomGenerator->getRandomElement($negativeTrait->visual_descriptors) ?? 'with subtle imperfections'
            : 'with subtle imperfections';

        // Get physical features
        $physicalFeatures = $species->features && count($species->features) > 0
            ? $this->randomGenerator->getRandomElements($species->features, 2)
            : [];

        $description = sprintf(
            "Portrait of a %s %s alien from a %s world, depicted in a %s style. %s variation. Physical features: %s. Hair: %s %s hair. Eyes: %s eyes that %s. Facial features include %s. Wearing %s with %s. Visual details: %s. The alien %s and %s, %s in %s. Holding a %s. Style elements: %s.",
            $gender,
            $species->class,
            $climate,
            $style,
            $variation,
            implode(', ', $physicalFeatures),
            $attributes['hairStyle'] ?? 'standard',
            $attributes['hairColor'] ?? 'natural',
            $attributes['eyeColor'] ?? 'brown',
            $attributes['eyeExpression'] ?? 'neutral gaze',
            $attributes['facialFeature'] ?? 'neutral expression',
            $attributes['clothing'] ?? 'standard clothing',
            $attributes['accessory'] ?? 'none',
            implode(', ', $visualDetails),
            $posTraitVisual,
            $negTraitVisual,
            $attributes['pose'] ?? 'stands',
            $attributes['background'] ?? 'neutral background',
            $artifact,
            $species->ai_prompt_elements ?? ''
        );

        return $description;
    }

    private function generateAlienNegativePrompt(): string
    {
        return 'low quality, blurry, inappropriate content, violence, gore, distorted proportions, unrealistic textures, oversaturated colors, poorly drawn features, asymmetrical when should be symmetrical, floating disconnected parts, inconsistent lighting, pixelated, artifacts';
    }

    private function generateAlienTags(
        string $class,
        string $climate,
        ?AlienTrait $positiveTrait,
        ?AlienTrait $negativeTrait,
        string $style,
        string $environment,
        string $artifact,
        string $gender,
        array $attributes
    ): array {
        $tags = [
            $class,
            $climate,
            $style,
            $environment,
            $artifact,
            $gender
        ];

        if ($positiveTrait) {
            $tags[] = $positiveTrait->name;
        }

        if ($negativeTrait) {
            $tags[] = $negativeTrait->name;
        }

        $tags[] = $attributes['hairColor'] ?? '';
        $tags[] = $attributes['eyeColor'] ?? '';
        $tags[] = $attributes['clothing'] ?? '';

        return array_filter($tags);
    }
}