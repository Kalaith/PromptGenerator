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

echo "Seeding default templates...\n";

try {
    // Insert default templates
    Capsule::table('templates')->insert([
        [
            'name' => 'Magical Girl',
            'description' => 'Classic magical girl character template with sparkles and transformation themes',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'human',
                'traits' => ['magical powers', 'colorful outfit', 'sparkles'],
                'style_modifiers' => ['magical girl anime', 'bright colors', 'transformation sequence'],
                'negative_prompts' => ['dark', 'gritty', 'realistic']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Dark Fantasy',
            'description' => 'Dark fantasy character with gothic elements',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'human',
                'traits' => ['mysterious', 'gothic clothing', 'dark magic'],
                'style_modifiers' => ['dark fantasy', 'gothic', 'dramatic lighting'],
                'negative_prompts' => ['bright colors', 'cheerful', 'childish']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Mecha Pilot',
            'description' => 'Futuristic mecha pilot character',
            'type' => 'anime',
            'template_data' => json_encode([
                'species' => 'human',
                'traits' => ['pilot suit', 'technology', 'confident'],
                'style_modifiers' => ['mecha anime', 'futuristic', 'cyberpunk'],
                'negative_prompts' => ['fantasy', 'medieval', 'magic']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Space Explorer',
            'description' => 'Alien character for space exploration scenarios',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Humanoid',
                'traits' => ['advanced technology', 'space suit', 'exploration gear'],
                'environment' => 'space station',
                'style_modifiers' => ['sci-fi', 'futuristic', 'clean technology'],
                'negative_prompts' => ['primitive', 'fantasy', 'medieval']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ],
        [
            'name' => 'Aquatic Civilization',
            'description' => 'Water-dwelling alien species template',
            'type' => 'alien',
            'template_data' => json_encode([
                'species_class' => 'Aquatic',
                'climate' => 'Ocean',
                'traits' => ['bio-luminescent', 'water adaptation', 'coral technology'],
                'style_modifiers' => ['underwater', 'bioluminescent', 'organic technology'],
                'negative_prompts' => ['dry', 'desert', 'fire']
            ]),
            'is_public' => true,
            'created_by' => 'system',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]
    ]);
    
    echo "✅ Default templates seeded successfully!\n";
} catch (Exception $e) {
    echo "❌ Seeding failed: " . $e->getMessage() . "\n";
}