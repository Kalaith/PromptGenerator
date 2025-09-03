<?php

use AnimePromptGen\Models\Species;

return new class {
    public function run(): void
    {
        // Monster Girl data
        $monsterGirls = [
            [
                'name' => 'Ryuujin',
                'type' => 'monsterGirl',
                'species_name' => 'dragon girl',
                'ears' => 'small horns instead of ears',
                'features' => ['draconic eyes', 'faint scales', 'a slender tail'],
                'personality' => ['mysterious', 'powerful', 'regal'],
                'negative_prompt' => 'multiple tails, full-body wings, oversized horns, ornate fantasy armor, glitch effects, malformed anatomy, blurry textures, distorted anatomy, missing features',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.'
            ],
            [
                'name' => 'Slime',
                'type' => 'monsterGirl',
                'species_name' => 'slime girl',
                'ears' => 'gelatinous protrusions resembling ears',
                'features' => ['semi-transparent body', 'amorphous shape', 'glowing core inside'],
                'personality' => ['playful', 'curious', 'adaptable'],
                'negative_prompt' => 'excessive dripping, multiple heads, hard surfaces, human skin texture, malformed anatomy, glitch effects, surreal layering',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} gel-like hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.'
            ],
            [
                'name' => 'Lamia',
                'type' => 'monsterGirl',
                'species_name' => 'lamia girl',
                'ears' => 'small pointed ears',
                'features' => ['long snake tail', 'slitted pupils', 'scale-covered lower body'],
                'personality' => ['seductive', 'cunning', 'calm'],
                'negative_prompt' => 'full-body frame, serpentine coils everywhere, fantasy throne, ornate jewelry, malformed anatomy, glitch effects, surreal shapes',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.'
            ],
            [
                'name' => 'Harpy',
                'type' => 'monsterGirl',
                'species_name' => 'harpy girl',
                'ears' => 'feathered crests instead of ears',
                'features' => ['avian eyes', 'feathered shoulders', 'small wings behind her'],
                'personality' => ['spirited', 'loud', 'mischievous'],
                'negative_prompt' => 'full wings in frame, bird legs, full-body pose, distorted feathers, malformed arms, glitch effects, extra limbs',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} feather-like hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.'
            ],
            [
                'name' => 'Oni',
                'type' => 'monsterGirl',
                'species_name' => 'oni girl',
                'ears' => 'pointed ears',
                'features' => ['small sharp horns', 'fang-like teeth', 'slightly red-tinted skin'],
                'personality' => ['boisterous', 'bold', 'battle-hardened'],
                'negative_prompt' => 'oversized horns, giant club weapon, heavy armor, glitch effects, distorted proportions, fantasy setting background',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.'
            ],
            [
                'name' => 'Insectoid',
                'type' => 'monsterGirl',
                'species_name' => 'insectoid girl',
                'ears' => 'antennae instead of ears',
                'features' => ['chitinous shoulder plating', 'faceted eyes', 'small wings on her back'],
                'personality' => ['quiet', 'precise', 'detached'],
                'negative_prompt' => 'multiple compound limbs, full bug body, glowing egg sacs, surreal insect armor, malformed eyes, glitch effects',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} hair (thin or segmented), and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.'
            ]
        ];

        foreach ($monsterGirls as $monsterGirl) {
            Species::create($monsterGirl);
        }
    }
};
