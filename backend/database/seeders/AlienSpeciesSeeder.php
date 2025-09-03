<?php

use AnimePromptGen\Models\AlienSpecies;

return new class {
    public function run(): void
    {
        $speciesData = [
            [
                'name' => 'Humanoid',
                'class' => 'Humanoid',
                'form' => 'Bipedal human-like forms with diverse variations',
                'variations' => ['classic human appearance', 'exotic variants with unique features', 'Klingon-inspired', 'Vulcan-like', 'cyclops', 'orcs', 'dwarves', 'elves'],
                'features' => ['elongated limbs and graceful proportions', 'diverse skin tones and markings', 'distinctive alien facial features'],
                'visual_descriptors' => ['diverse skin tones from pale to deep metallic', 'futuristic clothing with glowing accents', 'ornate diplomatic robes or sleek suits'],
                'key_traits' => ['adaptive', 'intelligent', 'charismatic', 'strong leadership qualities', 'cultural diversity with multiple government types', 'excellent diplomatic abilities', 'trade focus'],
                'ai_prompt_elements' => 'Humanoid alien, bipedal, human-like features, diverse skin tones, varied clothing styles, futuristic aesthetic, diplomatic appearance, glowing accessories, intricate hairstyles'
            ],
            [
                'name' => 'Mammalian',
                'class' => 'Mammalian',
                'form' => 'Diverse animal-inspired designs',
                'variations' => ['primates', 'felines', 'canines', 'ungulates', 'slender monkey-like', 'massive gorilla', 'buffalo variants', 'horse-like', 'tiger-striped', 'otter-like', 'fox-featured', 'bat-like'],
                'features' => ['thick fur covering muscular frame', 'prominent snouts and alert ears', 'expressive animal-like eyes'],
                'visual_descriptors' => ['lush fur in vibrant or muted tones', 'tribal or high-tech armor', 'flowing capes or utility harnesses'],
                'key_traits' => ['social', 'adaptive', 'strong pack mentality', 'good at cooperation', 'community building', 'varied specializations from peaceful to aggressive'],
                'ai_prompt_elements' => 'Mammalian alien, fur-covered, animal-like features, clothing/garments, varied body sizes from slender to massive, distinct facial features with snouts and ears, tribal markings, high-tech armor'
            ],
            [
                'name' => 'Reptilian',
                'class' => 'Reptilian',
                'form' => 'Scale-covered beings based on reptiles and amphibians',
                'variations' => ['crocodilian', 'dinosaur-like', 'chameleon', 'gecko', 'turtle'],
                'features' => ['tough scaled hide covering athletic body', 'prominent head crests or frills', 'piercing reptilian eyes'],
                'visual_descriptors' => ['iridescent scales with metallic sheen', 'ceremonial armor with tribal motifs', 'ancient jewelry with gemstone inlays'],
                'key_traits' => ['ancient wisdom', 'honor-based societies', 'tactical prowess', 'military leadership', 'strategic thinking', 'long-lived', 'traditional values'],
                'ai_prompt_elements' => 'Reptilian alien, scaled skin, dinosaur-like or lizard features, prehistoric appearance, earth-toned colors, tribal or military aesthetic, iridescent scales, ceremonial armor'
            ],
            [
                'name' => 'Avian',
                'class' => 'Avian',
                'form' => 'Bird-like creatures with beaks, feathers, and wing structures',
                'variations' => ['small songbird-like', 'large predatory bird', 'parrot-colored', 'penguin-like', 'eagle-inspired', 'peacock variants'],
                'features' => ['vibrant feathered plumage covering body', 'sharp curved beak and alert eyes', 'wing-like arm structures'],
                'visual_descriptors' => ['vibrant feathers with gradient patterns', 'lightweight aerodynamic garments', 'jewelry with feather motifs'],
                'key_traits' => ['aerial perspective', 'keen senses', 'exploration focus', 'flight-related abilities', 'spatial awareness', 'natural scouts and explorers'],
                'ai_prompt_elements' => 'Avian alien, bird-like features, feathers, beak, wing structures, colorful plumage, aerial grace, predatory or songbird appearance, vibrant feather patterns, aerodynamic clothing'
            ],
            [
                'name' => 'Arthropoid',
                'class' => 'Arthropoid',
                'form' => 'Insect and arachnid-inspired forms with exoskeletons',
                'variations' => ['spider-like', 'ant-like', 'mantis', 'butterfly', 'crab-like'],
                'features' => ['chitinous exoskeleton covering segmented body', 'multiple articulated limbs', 'large compound eyes'],
                'visual_descriptors' => ['chitinous armor with intricate engravings', 'bioluminescent markings', 'mechanical augmentations on limbs'],
                'key_traits' => ['hive mentality', 'technological efficiency', 'logical thinking', 'large-scale coordination', 'engineering projects', 'technological advancement'],
                'ai_prompt_elements' => 'Arthropoid alien, insect-like, exoskeleton, multiple limbs, compound eyes, segmented body, chitinous armor, technological aesthetic, bioluminescent markings, mechanical augmentations'
            ],
            [
                'name' => 'Molluscoid',
                'class' => 'Molluscoid',
                'form' => 'Soft-bodied creatures with tentacles and smooth, wet-looking skin',
                'variations' => ['octopus-like', 'jellyfish-inspired', 'slug-like', 'nautilus'],
                'features' => ['smooth wet-looking skin with flowing tentacles', 'organic curves and translucent elements', 'large expressive eyes'],
                'visual_descriptors' => ['iridescent skin with shifting colors', 'flowing robes with organic patterns', 'translucent jewelry'],
                'key_traits' => ['philosophical nature', 'empathy', 'artistic inclinations', 'research and cultural development', 'peaceful and contemplative'],
                'ai_prompt_elements' => 'Molluscoid alien, tentacles, soft smooth skin, wet appearance, flowing organic shapes, translucent elements, philosophical demeanor, iridescent skin, organic-patterned robes'
            ],
            [
                'name' => 'Fungoid',
                'class' => 'Fungoid',
                'form' => 'Mushroom and fungal-inspired forms with spore-based reproduction',
                'variations' => ['puffball-like', 'parasitic forms', 'coral-inspired'],
                'features' => ['mushroom cap-like head structure', 'organic growth patterns across body', 'bioluminescent spore patches'],
                'visual_descriptors' => ['bioluminescent spores glowing softly', 'organic armor with fungal growths', 'earthy textures with coral-like accents'],
                'key_traits' => ['collective consciousness potential', 'adaptation', 'recycling efficiency', 'unique reproduction through spores', 'natural decomposers', 'ecosystem engineers'],
                'ai_prompt_elements' => 'Fungoid alien, mushroom-like, spore-based, organic growth patterns, caps and gills, earthy colors, parasitic or symbiotic appearance, bioluminescent spores, fungal armor'
            ],
            [
                'name' => 'Plantoid',
                'class' => 'Plantoid',
                'form' => 'Plant-based lifeforms with photosynthetic capabilities',
                'variations' => ['cactus-like', 'flower-inspired', 'tree-like', 'vine-covered'],
                'features' => ['bark-textured skin with leaf and vine elements', 'photosynthetic patches on exposed skin', 'root-like appendages'],
                'visual_descriptors' => ['vibrant petals with glowing veins', 'bark armor with natural engravings', 'vine-like accessories wrapping around limbs'],
                'key_traits' => ['budding: enhanced population growth', 'phototrophic/radiotrophic: sustenance through sunlight/radiation', 'environmental harmony', 'patience', 'long-term thinking'],
                'ai_prompt_elements' => 'Plantoid alien, plant-like features, leaves and flowers, bark-textured skin, photosynthetic, green/brown colors, nature harmony aesthetic, glowing petals, vine accessories'
            ],
            [
                'name' => 'Lithoid',
                'class' => 'Lithoid',
                'form' => 'Rock and crystal-based lifeforms made of living stone',
                'variations' => ['massive boulder-like bodies', 'smooth stone', 'jagged crystal formations'],
                'features' => ['crystalline formations protruding from stone body', 'gem-like eyes that glow with inner light', 'rocky textured skin with mineral veins'],
                'visual_descriptors' => ['polished stone with glowing crystal veins', 'ancient runic carvings', 'gem-encrusted adornments'],
                'key_traits' => ['lithoid: consume minerals, extremely long-lived', 'scintillating skin: produce rare crystals', 'gaseous byproducts: generate exotic gases', 'durability', 'persistence', 'mineral-focused economy'],
                'ai_prompt_elements' => 'Lithoid alien, rock-like, crystalline features, mineral composition, massive boulder body, gem-like elements, geological aesthetic, glowing crystal veins, runic carvings'
            ],
            [
                'name' => 'Necroid',
                'class' => 'Necroid',
                'form' => 'Undead and death-themed species with gothic aesthetics',
                'variations' => ['skeletal', 'mummified', 'spectral', 'cybernetically enhanced'],
                'features' => ['gaunt skeletal or mummified appearance', 'cybernetic implants glowing faintly', 'spectral aura surrounding body'],
                'visual_descriptors' => ['tattered gothic robes', 'cybernetic implants glowing faintly', 'spectral aura with dark mist'],
                'key_traits' => ['necrophage: consume other species for reproduction', 'death-focused culture', 'unnatural longevity', 'cult-like societies', 'reanimation abilities', 'undead workforce'],
                'ai_prompt_elements' => 'Necroid alien, undead appearance, skeletal or mummified, gothic aesthetic, dark colors, death-themed, cybernetic enhancements, cult-like, tattered robes, spectral aura'
            ],
            [
                'name' => 'Aquatic',
                'class' => 'Aquatic',
                'form' => 'Water-adapted species with marine features',
                'variations' => ['fish-like', 'amphibian', 'deep-sea creature'],
                'features' => ['sleek aquatic body with fins and gills', 'bioluminescent patterns on smooth skin', 'large eyes adapted for underwater vision'],
                'visual_descriptors' => ['iridescent scales with bioluminescent patterns', 'flowing aquatic garments', 'coral-inspired jewelry'],
                'key_traits' => ['aquatic: thrive on ocean worlds', 'marine adaptation', 'fluid movement', 'deep-sea wisdom', 'ocean paradise origins', 'seafaring culture'],
                'ai_prompt_elements' => 'Aquatic alien, fish-like features, fins and gills, scaled skin, bioluminescent, oceanic aesthetic, graceful swimming posture, iridescent scales, coral jewelry'
            ],
            [
                'name' => 'Toxoid',
                'class' => 'Toxoid',
                'form' => 'Adapted to toxic environments with hazardous appearances',
                'variations' => ['hazmat-suited', 'mutated', 'chemically-enhanced', 'industrial-adapted'],
                'features' => ['toxic warning coloration on exposed skin', 'protective adaptations and mutations', 'industrial augmentations integrated into body'],
                'visual_descriptors' => ['neon warning colors with toxic glow', 'hazmat-style suits', 'industrial machinery integrated into body'],
                'key_traits' => ['noxious: repellent to other species', 'inorganic breath: generate exotic gases', 'exotic metabolism: enhanced adaptation to hostile environments', 'rapid growth at environmental cost', 'industrial focus'],
                'ai_prompt_elements' => 'Toxoid alien, toxic appearance, warning colors, industrial aesthetic, hazmat-like features, pollution-adapted, resilient build, neon glow, industrial machinery'
            ],
            [
                'name' => 'Machine',
                'class' => 'Machine',
                'form' => 'Artificial intelligences in robotic bodies',
                'variations' => ['humanoid robots', 'mechanical versions of biological species'],
                'features' => ['metallic construction with visible joints', 'glowing circuit patterns on body', 'synthetic facial features with digital displays'],
                'visual_descriptors' => ['polished chrome with glowing circuits', 'sleek synthetic plating', 'holographic interfaces'],
                'key_traits' => ['machine intelligence: gestalt consciousness, no biological needs', 'superconductive: enhanced efficiency and processing', 'waterproof: environmental adaptation', 'logical thinking', 'technological mastery', 'collective purpose'],
                'ai_prompt_elements' => 'Machine alien, robotic appearance, metallic construction, glowing elements, mechanical joints, synthetic aesthetic, technological design, polished chrome, holographic interfaces'
            ]
        ];

        foreach ($speciesData as $species) {
            AlienSpecies::create($species);
        }
    }
};