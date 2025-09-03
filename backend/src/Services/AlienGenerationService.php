<?php

declare(strict_types=1);

namespace AnimePromptGen\Services;

use AnimePromptGen\External\AlienSpeciesRepository;
use AnimePromptGen\External\AlienTraitRepository;
use AnimePromptGen\External\AttributeRepository;
use AnimePromptGen\External\GameAssetRepository;
use AnimePromptGen\Models\AlienSpecies;
use AnimePromptGen\Models\AlienTrait;

final class AlienGenerationService extends BaseGenerationService
{
    public function __construct(
        private readonly AlienSpeciesRepository $alienSpeciesRepository,
        private readonly AlienTraitRepository $alienTraitRepository,
        AttributeRepository $attributeRepository,
        GameAssetRepository $gameAssetRepository,
        RandomGeneratorService $randomGenerator
    ) {
        parent::__construct($attributeRepository, $gameAssetRepository, $randomGenerator);
    }

    public function generatePromptData(
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
        $selectedGender = $gender ?? $this->getRandomGender();

        // Generate traits
        $positiveTrait = $this->getTraitForGeneration('positive', $positiveTrait);
        $negativeTrait = $this->getTraitForGeneration('negative', $negativeTrait);

        // Generate artistic style
        $selectedStyle = $style ?? $this->getRandomArtisticStyle();

        // Generate environment
        $selectedEnvironment = $environment ?? $this->getRandomEnvironment();

        // Generate cultural artifact
        $selectedArtifact = $this->getRandomCulturalArtifact();

        // Generate extended attributes with species adaptations
        $attributes = $this->generateExtendedAttributes($selectedGender, $selectedStyle, $selectedEnvironment);
        $attributes = $this->adaptAttributesToSpecies($attributes, $actualClass);

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
            'negative_prompt' => $this->generateStandardNegativePrompt(),
            'tags' => $this->generateBaseTags($attributes, [
                $actualClass, 
                $selectedClimate, 
                $positiveTrait?->name ?? '', 
                $negativeTrait?->name ?? '', 
                $selectedArtifact
            ])
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
        $climate = $this->gameAssetRepository->getRandomByType('climate');
        return $climate ? $climate->name : 'Continental';
    }

    public function getAvailableClimates(): array
    {
        $climates = $this->gameAssetRepository->getByType('climate');
        return array_map(fn($climate) => $climate->name, $climates);
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

    private function adaptAttributesToSpecies(array $attributes, string $speciesClass): array
    {
        // Adapt hair attributes based on species type
        if (in_array($speciesClass, ['Humanoid', 'Mammalian', 'Necroid'])) {
            // Species that can have traditional hair - keep original attributes
        } elseif ($speciesClass === 'Avian') {
            $attributes['hairStyle'] = 'feathered crest';
        } elseif ($speciesClass === 'Plantoid') {
            $attributes['hairColor'] = $this->randomGenerator->getRandomElement(['green', 'brown', 'yellow', 'red', 'orange']) ?? $attributes['hairColor'];
            $attributes['hairStyle'] = 'leaf-like fronds';
        } elseif ($speciesClass === 'Machine') {
            $attributes['hairColor'] = 'metallic';
            $attributes['hairStyle'] = 'synthetic fibers';
        } else {
            $attributes['hairColor'] = $this->randomGenerator->getRandomElement(['iridescent', 'bioluminescent', 'crystalline', 'ethereal']) ?? $attributes['hairColor'];
            $attributes['hairStyle'] = 'alien appendages';
        }

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

        $template = "Portrait of a {gender} {class} alien from a {climate} world, depicted in a {artisticStyle} style. {variation} variation. Physical features: {physicalFeatures}. Hair: {hairStyle} {hairColor} hair. Eyes: {eyeColor} eyes that {eyeExpression}. Facial features include {facialFeatures}. Wearing {clothing} with {accessory}. Visual details: {visualDetails}. The alien {posTraitVisual} and {negTraitVisual}, {pose} in {environment}. Holding a {artifact}. Style elements: {aiPromptElements}.";

        $replacements = array_merge($attributes, [
            'class' => $species->class,
            'climate' => $climate,
            'variation' => $variation,
            'physicalFeatures' => implode(', ', $physicalFeatures),
            'visualDetails' => implode(', ', $visualDetails),
            'posTraitVisual' => $posTraitVisual,
            'negTraitVisual' => $negTraitVisual,
            'artifact' => $artifact,
            'aiPromptElements' => $species->ai_prompt_elements ?? ''
        ]);

        return $this->processTemplate($template, $replacements);
    }

}