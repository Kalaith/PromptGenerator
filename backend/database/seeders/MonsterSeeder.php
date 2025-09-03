<?php

use AnimePromptGen\Models\Species;

return new class {
    public function run(): void
    {
        // Monster data
        $monsters = [
            [
                'name' => 'Dragon',
                'type' => 'monster',
                'species_name' => 'massive dragon',
                'ears' => 'curved horns extending from its skull',
                'tail' => 'a long, muscular tail lined with spines',
                'wings' => 'broad leathery wings that stretch wide behind it',
                'features' => [
                    'obsidian scales that glint in the light',
                    'burning eyes filled with ancient intelligence',
                    'razor-sharp claws',
                    'a thunderous roar'
                ],
                'personality' => ['dominant', 'ancient', 'wrathful'],
                'negative_prompt' => 'multiple heads, humanoid shape, tiny wings, ornate fantasy armor, glitch effects, malformed limbs, cartoon style',
                'description_template' => 'A {personality} {species} with {features}. It has {ears}, {tail}, and {wings}, looming over a {background}.'
            ],
            [
                'name' => 'Behemoth',
                'type' => 'monster',
                'species_name' => 'colossal behemoth',
                'ears' => 'no visible ears, only armored ridges',
                'tail' => 'a thick tail like a battering ram',
                'features' => [
                    'stone-like hide cracked with glowing magma veins',
                    'tusks the size of trees',
                    'clawed limbs made for crushing mountains',
                    'a massive underbelly that drags across the ground'
                ],
                'personality' => ['unstoppable', 'brutal', 'ancient'],
                'negative_prompt' => 'humanoid traits, wings, glowing weapons, sleek design, glitch effects, fantasy armor',
                'description_template' => 'An {personality} {species} with {features}. It has {ears} and {tail}, advancing through a {background} with unstoppable force.'
            ],
            [
                'name' => 'Wyrm',
                'type' => 'monster',
                'species_name' => 'serpentine wyrm',
                'ears' => 'smooth fin-like frills on either side of its head',
                'tail' => 'its entire body forms an endless tail',
                'features' => [
                    'shimmering scales',
                    'a finned body that coils through the air',
                    'a gaping maw with needle teeth',
                    'a trail of magical mist in its wake'
                ],
                'personality' => ['mysterious', 'elusive', 'primordial'],
                'negative_prompt' => 'legs, humanoid shape, ornate decorations, glitch effects, cartoon features',
                'description_template' => 'A {personality} {species} with {features}. It has {ears} and {tail}, weaving through a {background} like living mist.'
            ],
            [
                'name' => 'Chimera',
                'type' => 'monster',
                'species_name' => 'twisted chimera',
                'ears' => 'three mismatched animal heads with ragged ears',
                'tail' => 'a venomous serpent tail that hisses behind it',
                'wings' => 'bat-like wings stitched with veins',
                'features' => [
                    'a lion\'s body with patches of scales and fur',
                    'clawed limbs that shift with each movement',
                    'a grotesque fusion of beasts',
                    'eyes that burn with chaotic energy'
                ],
                'personality' => ['chaotic', 'vicious', 'unnatural'],
                'negative_prompt' => 'clean symmetry, humanoid traits, decorative armor, glitch effects, cartoon faces',
                'description_template' => 'A {personality} {species} with {features}. It has {ears}, {tail}, and {wings}, stalking through a {background} like a nightmare made flesh.'
            ],
            [
                'name' => 'Leviathan',
                'type' => 'monster',
                'species_name' => 'ancient leviathan',
                'ears' => 'long fins flowing from its skull',
                'tail' => 'an enormous sea-serpent tail vanishing into the deep',
                'features' => [
                    'a scale-armored body stretching for hundreds of meters',
                    'bioluminescent markings pulsing with eerie light',
                    'whisker-like tendrils for sensing vibrations',
                    'a titanic jaw lined with rows of teeth'
                ],
                'personality' => ['cosmic', 'inevitable', 'silent'],
                'negative_prompt' => 'humanoid features, bright fantasy setting, legs, decorative armor, glitch effects',
                'description_template' => 'A {personality} {species} with {features}. It has {ears} and {tail}, gliding silently beneath a {background}.'
            ],
            [
                'name' => 'Golem',
                'type' => 'monster',
                'species_name' => 'ancient stone golem',
                'ears' => 'none, just a carved stone head',
                'features' => [
                    'runic engravings glowing faintly across its body',
                    'immense arms like fallen pillars',
                    'a body made of fused boulders and ancient bricks',
                    'a hollow chest housing a glowing core'
                ],
                'personality' => ['stoic', 'eternal', 'unyielding'],
                'negative_prompt' => 'organic skin, armor plating, humanoid softness, glitch effects, fantasy clothes',
                'description_template' => 'A {personality} {species} with {features}. It has {ears} and looms motionless within a {background}.'
            ],
            [
                'name' => 'Manticore',
                'type' => 'monster',
                'species_name' => 'feral manticore',
                'ears' => 'pointed feline ears with tufts',
                'tail' => 'a long scorpion tail tipped with venomous barbs',
                'wings' => 'broad bat wings used for sudden pounces',
                'features' => [
                    'a lion\'s body with crimson fur',
                    'sharp fangs protruding from its mouth',
                    'eyes full of bloodlust',
                    'powerful paws with dagger-like claws'
                ],
                'personality' => ['aggressive', 'predatory', 'wild'],
                'negative_prompt' => 'humanoid traits, feathered wings, fantasy armor, glitch effects, cartoon expressions',
                'description_template' => 'A {personality} {species} with {features}. It has {ears}, {tail}, and {wings}, ready to strike from the shadows of a {background}.'
            ]
        ];

        foreach ($monsters as $monster) {
            Species::create($monster);
        }
    }
};
