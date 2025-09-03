<?php

use AnimePromptGen\Models\Species;

return new class {
    public function run(): void
    {
        // Animal Girl data
        $animalGirls = [
            [
                'name' => 'Nekomimi',
                'type' => 'animalGirl',
                'species_name' => 'cat girl',
                'ears' => 'feline ears',
                'tail' => 'a sleek feline tail',
                'features' => ['whiskers', 'cat-like eyes'],
                'personality' => ['curious', 'playful', 'agile'],
                'negative_prompt' => 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Inumimi',
                'type' => 'animalGirl',
                'species_name' => 'dog girl',
                'ears' => 'floppy ears',
                'tail' => 'a wagging dog tail',
                'features' => ['loyal eyes', 'dog-like features'],
                'personality' => ['loyal', 'dependable', 'brave', 'confident'],
                'negative_prompt' => 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Kitsunemimi',
                'type' => 'animalGirl',
                'species_name' => 'fox girl',
                'ears' => 'fox ears',
                'tail' => 'a bushy fox tail',
                'features' => ['intelligent eyes', 'fox-like features'],
                'personality' => ['intelligent', 'cunning', 'scholarly', 'thoughtful'],
                'negative_prompt' => 'multiple tails, kimono, fantasy effects, ornate style, glitch effects, malformed anatomy',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Usagimimi',
                'type' => 'animalGirl',
                'species_name' => 'rabbit girl',
                'ears' => 'long rabbit ears',
                'tail' => 'a small fluffy tail',
                'features' => ['large eyes', 'rabbit-like features'],
                'personality' => ['shy', 'alert', 'cautious', 'timid', 'focused'],
                'negative_prompt' => 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Ookami',
                'type' => 'animalGirl',
                'species_name' => 'wolf girl',
                'ears' => 'wolf ears',
                'tail' => 'a bushy wolf tail',
                'features' => ['strong jawline', 'wolf-like features'],
                'personality' => ['strong', 'confident', 'assertive', 'bold', 'determined'],
                'negative_prompt' => 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Nezumimi',
                'type' => 'animalGirl',
                'species_name' => 'mouse girl',
                'ears' => 'round mouse ears',
                'tail' => 'a thin mouse tail',
                'features' => ['small frame', 'mouse-like features'],
                'personality' => ['resourceful', 'sly', 'serious', 'clever'],
                'negative_prompt' => 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Ryūjin',
                'type' => 'animalGirl',
                'species_name' => 'dragon girl',
                'ears' => 'small horns',
                'tail' => 'a slender dragon tail',
                'wings' => 'small dragon wings',
                'features' => ['scales on cheeks', 'dragon features', 'faint scales'],
                'personality' => ['calm', 'mysterious', 'powerful'],
                'negative_prompt' => 'extra limbs, wings, tails, surreal features, blurry textures, ornate armor, fantasy background, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Tanukimimi',
                'type' => 'animalGirl',
                'species_name' => 'tanuki girl',
                'ears' => 'rounded tanuki ears',
                'tail' => 'a fluffy tanuki tail',
                'features' => ['fluffy features', 'tanuki-like traits'],
                'personality' => ['playful', 'mischievous', 'cheerful'],
                'negative_prompt' => 'extra limbs, exaggerated tail, ornate clothing, fantasy elements, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Torimimi',
                'type' => 'animalGirl',
                'species_name' => 'bird girl',
                'ears' => 'feathered ear tufts',
                'wings' => 'small bird wings',
                'features' => ['sharp eyes', 'feathery bangs', 'bird-like features'],
                'personality' => ['sharp', 'alert', 'focused'],
                'negative_prompt' => 'wings, flying pose, feathers on arms, fantasy background, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Kumamimi',
                'type' => 'animalGirl',
                'species_name' => 'bear girl',
                'ears' => 'round bear ears',
                'features' => ['strong build', 'bear-like features'],
                'personality' => ['reliable', 'calm', 'strong', 'steady'],
                'negative_prompt' => 'hulking build, bear paws, fur coat, fantasy setting, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Insectomimi',
                'type' => 'animalGirl',
                'species_name' => 'insect girl',
                'ears' => 'slender antennae',
                'wings' => 'transparent insect wings',
                'features' => ['compound eyes', 'chitinous accents', 'insect-like features'],
                'personality' => ['quiet', 'analytical', 'precise'],
                'negative_prompt' => 'oversized mandibles, full insect body, multiple limbs, glitch effects, malformed anatomy, cartoon features',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Caprimimi',
                'type' => 'animalGirl',
                'species_name' => 'goat girl',
                'ears' => 'curved goat ears',
                'tail' => 'a small goat tail',
                'features' => ['small horns', 'slit pupils', 'goat-like features'],
                'personality' => ['stubborn', 'independent', 'clever'],
                'negative_prompt' => 'full goat body, hooves, surreal horns, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Ushimimi',
                'type' => 'animalGirl',
                'species_name' => 'cow girl',
                'ears' => 'rounded cow ears',
                'tail' => 'a short cow tail',
                'features' => ['small horns', 'broad eyes', 'cow-like features'],
                'personality' => ['gentle', 'patient', 'loyal'],
                'negative_prompt' => 'udder, hooves, full cow body, fantasy armor, glitch effects, malformed anatomy',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Shikamimi',
                'type' => 'animalGirl',
                'species_name' => 'deer girl',
                'ears' => 'long deer ears',
                'tail' => 'a short deer tail',
                'features' => ['small antlers', 'graceful posture', 'deer-like features'],
                'personality' => ['graceful', 'reserved', 'alert'],
                'negative_prompt' => 'deer legs, large antlers, hooves, fantasy ornaments, glitch effects, malformed anatomy',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Hebimimi',
                'type' => 'animalGirl',
                'species_name' => 'snake girl',
                'ears' => 'smooth scale patches where ears would be',
                'tail' => 'a long slender snake tail',
                'features' => ['slitted pupils', 'forked tongue', 'reptilian features'],
                'personality' => ['mysterious', 'cool-headed', 'seductive'],
                'negative_prompt' => 'full snake tail body, extra limbs, snake mouth, surreal anatomy, glitch effects',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Koumorimimi',
                'type' => 'animalGirl',
                'species_name' => 'bat girl',
                'ears' => 'large pointed bat ears',
                'wings' => 'small bat wings',
                'features' => ['sharp fangs', 'nocturnal eyes', 'bat-like features'],
                'personality' => ['noisy', 'energetic', 'curious'],
                'negative_prompt' => 'full bat wingspan, rodent muzzle, fantasy costume, glitch effects, malformed anatomy',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Umamimi',
                'type' => 'animalGirl',
                'species_name' => 'horse girl',
                'ears' => 'upright horse ears',
                'tail' => 'a long horse tail',
                'features' => ['long face shape', 'large expressive eyes', 'horse-like features'],
                'personality' => ['strong', 'hardworking', 'disciplined'],
                'negative_prompt' => 'horse nose, hooves, full equine body, racing gear, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Irukamimi',
                'type' => 'animalGirl',
                'species_name' => 'dolphin girl',
                'ears' => 'smooth fin-like ears',
                'tail' => 'a smooth dolphin-like tail fin',
                'features' => ['playful eyes', 'sleek skin texture', 'dolphin-like features'],
                'personality' => ['friendly', 'energetic', 'curious'],
                'negative_prompt' => 'dolphin head, full tail body, fish scales, blowhole, flippers, cartoon features, glitch effects, malformed anatomy',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Samemimi',
                'type' => 'animalGirl',
                'species_name' => 'shark girl',
                'ears' => 'small gill-like ridges where ears would be',
                'tail' => 'a crescent-shaped shark tail',
                'features' => ['sharp teeth', 'strong jawline', 'shark-like features'],
                'personality' => ['confident', 'predatory', 'focused'],
                'negative_prompt' => 'full shark head, dorsal fin on head, heavy gills, webbed fingers, glitch effects, malformed anatomy',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Kuragemimi',
                'type' => 'animalGirl',
                'species_name' => 'jellyfish girl',
                'ears' => 'small transparent fins',
                'tail' => 'flowing jelly-like strands resembling a tail',
                'features' => ['translucent skin', 'soft glowing patterns', 'jellyfish-like features'],
                'personality' => ['gentle', 'drifting', 'enigmatic'],
                'negative_prompt' => 'tentacle limbs, bloated jelly body, missing face, gelatinous mass, glitch effects, malformed anatomy',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Sakana',
                'type' => 'animalGirl',
                'species_name' => 'fish girl',
                'ears' => 'small fin-like ear flaps',
                'tail' => 'a wide flowing fish tail',
                'features' => ['gill marks on neck', 'shiny scales on cheeks', 'fish-like features'],
                'personality' => ['quiet', 'calm', 'watchful'],
                'negative_prompt' => 'fish head, full scaly body, fins for hands, surreal mutations, glitch effects, malformed anatomy',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ],
            [
                'name' => 'Umigamimimi',
                'type' => 'animalGirl',
                'species_name' => 'sea turtle girl',
                'ears' => 'rounded turtle ear flaps',
                'tail' => 'a small turtle tail',
                'features' => ['serene expression', 'slightly textured skin', 'turtle-like features'],
                'personality' => ['wise', 'patient', 'steady'],
                'negative_prompt' => 'turtle shell on back, flipper arms, oversized head, cartoon limbs, glitch effects, malformed faces',
                'description_template' => 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.'
            ]
        ];

        foreach ($animalGirls as $animalGirl) {
            Species::create($animalGirl);
        }
    }
};
