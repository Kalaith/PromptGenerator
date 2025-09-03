<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database
$capsule = require __DIR__ . '/config/database.php';

echo "Seeding additional templates...\n";

try {
    $additionalTemplates = [
        // More Anime Templates
        [
            'name' => 'Ninja Assassin',
            'description' => 'Stealthy ninja character with traditional Japanese elements',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'human',
                'traits' => ['stealth', 'ninja outfit', 'katana', 'agile'],
                'style_modifiers' => ['anime ninja', 'traditional Japanese', 'shadowy', 'action pose'],
                'negative_prompts' => ['bright colors', 'loud', 'clumsy', 'western']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Cyberpunk Hacker',
            'description' => 'Futuristic hacker with cyberpunk aesthetics',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'human',
                'traits' => ['cybernetic implants', 'neon hair', 'tech gear', 'hacker outfit'],
                'style_modifiers' => ['cyberpunk anime', 'neon lights', 'futuristic city', 'digital effects'],
                'negative_prompts' => ['natural', 'rural', 'traditional', 'low-tech']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Vampire Noble',
            'description' => 'Elegant vampire character with gothic romance elements',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'vampire',
                'traits' => ['pale skin', 'elegant clothing', 'red eyes', 'aristocratic'],
                'style_modifiers' => ['gothic anime', 'dark romance', 'Victorian era', 'moonlight'],
                'negative_prompts' => ['sunny', 'cheerful', 'common', 'modern casual']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Cat Girl Maid',
            'description' => 'Classic anime cat girl in maid outfit',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'catgirl',
                'traits' => ['cat ears', 'cat tail', 'maid outfit', 'playful', 'cute'],
                'style_modifiers' => ['moe anime', 'kawaii', 'domestic setting', 'soft lighting'],
                'negative_prompts' => ['serious', 'dark', 'aggressive', 'masculine']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Dragon Slayer',
            'description' => 'Heroic fantasy warrior specialized in dragon hunting',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'human',
                'traits' => ['dragon scale armor', 'legendary sword', 'battle scars', 'heroic pose'],
                'style_modifiers' => ['fantasy anime', 'epic battle', 'dragon motifs', 'heroic lighting'],
                'negative_prompts' => ['cowardly', 'modern', 'weak', 'peaceful']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Shrine Maiden',
            'description' => 'Traditional Japanese shrine maiden with spiritual powers',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'human',
                'traits' => ['shrine maiden outfit', 'spiritual powers', 'prayer beads', 'pure aura'],
                'style_modifiers' => ['traditional Japanese', 'shrine setting', 'spiritual energy', 'cherry blossoms'],
                'negative_prompts' => ['modern', 'corrupted', 'dark magic', 'western']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],

        // More Alien Templates
        [
            'name' => 'Insectoid Warrior',
            'description' => 'Fierce insect-like alien warrior with hive mentality',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Insectoid',
                'traits' => ['chitinous armor', 'compound eyes', 'multiple limbs', 'warrior caste'],
                'environment' => 'hive colony',
                'style_modifiers' => ['biomechanical', 'insect-inspired', 'collective society', 'alien technology'],
                'negative_prompts' => ['mammalian', 'individual', 'soft', 'human-like']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Crystalline Being',
            'description' => 'Silicon-based life form with crystal structure',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Crystalline',
                'traits' => ['crystal structure', 'light refraction', 'mineral composition', 'geometric patterns'],
                'environment' => 'crystal caves',
                'climate' => 'mineral rich',
                'style_modifiers' => ['crystalline', 'prismatic', 'geometric', 'light effects'],
                'negative_prompts' => ['organic', 'soft', 'flesh', 'rounded']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Gaseous Entity',
            'description' => 'Energy-based alien existing in gaseous form',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Gaseous',
                'traits' => ['translucent form', 'energy manipulation', 'shape-shifting', 'electromagnetic field'],
                'environment' => 'gas giant atmosphere',
                'style_modifiers' => ['ethereal', 'energy effects', 'translucent', 'flowing form'],
                'negative_prompts' => ['solid', 'rigid', 'physical', 'dense']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Jungle Predator',
            'description' => 'Camouflaged alien hunter adapted to dense vegetation',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Reptilian',
                'traits' => ['adaptive camouflage', 'predator instincts', 'vine-like appendages', 'enhanced senses'],
                'environment' => 'dense jungle',
                'climate' => 'tropical',
                'style_modifiers' => ['jungle camouflage', 'predatory', 'organic technology', 'stealth'],
                'negative_prompts' => ['obvious', 'metallic', 'urban', 'bright colors']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Ice World Survivor',
            'description' => 'Hardy alien adapted to extreme cold environments',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Mammalian',
                'traits' => ['thick fur', 'ice resistance', 'thermal regulation', 'survival gear'],
                'environment' => 'ice plains',
                'climate' => 'arctic',
                'style_modifiers' => ['ice world', 'survival theme', 'cold adaptation', 'harsh environment'],
                'negative_prompts' => ['tropical', 'heat', 'thin', 'desert']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Void Wanderer',
            'description' => 'Mysterious alien from the depths of space',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Ethereal',
                'traits' => ['void adaptation', 'cosmic energy', 'star navigation', 'ancient wisdom'],
                'environment' => 'deep space',
                'style_modifiers' => ['cosmic', 'mysterious', 'ancient', 'star field background'],
                'negative_prompts' => ['planetary', 'young', 'mundane', 'earthly']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Techno-Organic Hybrid',
            'description' => 'Alien species that merges biology with advanced technology',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Humanoid',
                'traits' => ['bio-mechanical fusion', 'living technology', 'adaptive systems', 'neural interfaces'],
                'environment' => 'bio-tech laboratory',
                'style_modifiers' => ['bio-mechanical', 'organic technology', 'cybernetic', 'evolutionary'],
                'negative_prompts' => ['purely organic', 'primitive', 'natural', 'low-tech']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]
    ];

    Capsule::table('templates')->insert($additionalTemplates);
    
    echo "✅ Successfully seeded " . count($additionalTemplates) . " additional templates!\n";
    echo "\nAnime Templates Added:\n";
    echo "- Ninja Assassin\n";
    echo "- Cyberpunk Hacker\n";
    echo "- Vampire Noble\n";
    echo "- Cat Girl Maid\n";
    echo "- Dragon Slayer\n";
    echo "- Shrine Maiden\n";
    echo "\nAlien Templates Added:\n";
    echo "- Insectoid Warrior\n";
    echo "- Crystalline Being\n";
    echo "- Gaseous Entity\n";
    echo "- Jungle Predator\n";
    echo "- Ice World Survivor\n";
    echo "- Void Wanderer\n";
    echo "- Techno-Organic Hybrid\n";
    
} catch (Exception $e) {
    echo "❌ Seeding failed: " . $e->getMessage() . "\n";
}