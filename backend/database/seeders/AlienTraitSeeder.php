<?php

use AnimePromptGen\Models\AlienTrait;

return new class {
    public function run(): void
    {
        $traits = [
            // Positive traits
            [
                'name' => 'Intelligent',
                'type' => 'positive',
                'effect' => '+10% research speed',
                'visual_descriptors' => ['with wise, calculating eyes', 'showing signs of advanced intellect', 'with a scholarly demeanor']
            ],
            [
                'name' => 'Charismatic',
                'type' => 'positive',
                'effect' => '+25% other species happiness',
                'visual_descriptors' => ['with a commanding, regal presence', 'radiating natural authority', 'with an magnetic aura']
            ],
            [
                'name' => 'Strong/Very Strong',
                'type' => 'positive',
                'effect' => 'Enhanced physical capabilities',
                'visual_descriptors' => ['with a powerful, muscular build', 'showing impressive physical strength', 'with robust, athletic physique']
            ],
            [
                'name' => 'Adaptive',
                'type' => 'positive',
                'effect' => '+10% habitability to all worlds',
                'visual_descriptors' => ['showing evolutionary adaptations', 'with versatile features', 'displaying environmental modifications']
            ],
            [
                'name' => 'Rapid Breeders',
                'type' => 'positive',
                'effect' => '+10% population growth',
                'visual_descriptors' => ['with vibrant, healthy appearance', 'showing signs of vitality', 'with youthful energy']
            ],

            // Negative traits
            [
                'name' => 'Slow Breeders',
                'type' => 'negative',
                'effect' => '-10% population growth',
                'visual_descriptors' => ['with ancient, weathered features', 'showing signs of age and wisdom', 'with a dignified, elderly bearing']
            ],
            [
                'name' => 'Weak',
                'type' => 'negative',
                'effect' => 'Reduced ground combat strength',
                'visual_descriptors' => ['with a slender, delicate build', 'showing refined, non-physical focus', 'with an intellectual rather than physical presence']
            ],
            [
                'name' => 'Repugnant',
                'type' => 'negative',
                'effect' => '-20% amenities from jobs',
                'visual_descriptors' => ['with unusual, unsettling features', 'having an alien, uncomfortable appearance', 'with disturbing visual elements']
            ],
            [
                'name' => 'Nonadaptive',
                'type' => 'negative',
                'effect' => '-10% habitability',
                'visual_descriptors' => ['with rigid, unchanging features', 'showing environmental struggle', 'with signs of environmental mismatch']
            ],
            [
                'name' => 'Fleeting',
                'type' => 'negative',
                'effect' => 'Reduced leader lifespan',
                'visual_descriptors' => ['with ephemeral, translucent qualities', 'showing temporary, fragile nature', 'with a transient appearance']
            ]
        ];

        foreach ($traits as $trait) {
            AlienTrait::create($trait);
        }
    }
};