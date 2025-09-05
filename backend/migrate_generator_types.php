<?php

declare(strict_types=1);

// Simple migration script to expand generator types
require __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as DB;

// Load environment
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Set up database connection
require __DIR__ . '/config/database.php';

echo "Running generator types migration...\n";

try {
    // Step 1: Change ENUM to VARCHAR for flexibility (supports dynamic generator types)
    echo "1. Converting generator_type from ENUM to VARCHAR for dynamic types...\n";
    DB::statement("
        ALTER TABLE attribute_config 
        MODIFY COLUMN generator_type VARCHAR(50) NOT NULL
    ");
    
    // Step 2: Add animalGirl attributes
    echo "2. Adding animalGirl attributes...\n";
    $animalGirlAttributes = [
        ['animalGirl', 'hair_colors', 'Hair Color', 'select', true, 10],
        ['animalGirl', 'eye_colors', 'Eye Color', 'select', true, 20],
        ['animalGirl', 'hair_styles', 'Hair Style', 'select', true, 30],
        ['animalGirl', 'ear_types', 'Ear Type', 'select', true, 40],
        ['animalGirl', 'tail_types', 'Tail Type', 'select', true, 50],
        ['animalGirl', 'poses', 'Pose', 'select', true, 60],
        ['animalGirl', 'accessories', 'Accessory', 'select', true, 70],
        ['animalGirl', 'facial_features', 'Facial Features', 'multi-select', true, 80],
        ['animalGirl', 'gender', 'Gender', 'select', true, 90],
        ['animalGirl', 'artistic_style', 'Art Style', 'select', true, 100],
        ['animalGirl', 'environment', 'Environment', 'select', true, 110]
    ];
    
    foreach ($animalGirlAttributes as $attr) {
        try {
            DB::table('attribute_config')->insert([
                'generator_type' => $attr[0],
                'category' => $attr[1],
                'label' => $attr[2],
                'input_type' => $attr[3],
                'is_active' => $attr[4],
                'sort_order' => $attr[5],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            // Skip if already exists (duplicate key)
            if (strpos($e->getMessage(), 'Duplicate entry') === false) {
                throw $e;
            }
        }
    }
    
    // Step 3: Add monsterGirl attributes
    echo "3. Adding monsterGirl attributes...\n";
    $monsterGirlAttributes = [
        ['monsterGirl', 'hair_colors', 'Hair Color', 'select', true, 10],
        ['monsterGirl', 'eye_colors', 'Eye Color', 'select', true, 20],
        ['monsterGirl', 'monster_features', 'Monster Features', 'multi-select', true, 30],
        ['monsterGirl', 'wings', 'Wing Type', 'select', true, 40],
        ['monsterGirl', 'horns', 'Horn Type', 'select', true, 50],
        ['monsterGirl', 'tail_types', 'Tail Type', 'select', true, 60],
        ['monsterGirl', 'poses', 'Pose', 'select', true, 70],
        ['monsterGirl', 'accessories', 'Accessory', 'select', true, 80],
        ['monsterGirl', 'gender', 'Gender', 'select', true, 90],
        ['monsterGirl', 'artistic_style', 'Art Style', 'select', true, 100],
        ['monsterGirl', 'environment', 'Environment', 'select', true, 110]
    ];
    
    foreach ($monsterGirlAttributes as $attr) {
        try {
            DB::table('attribute_config')->insert([
                'generator_type' => $attr[0],
                'category' => $attr[1],
                'label' => $attr[2],
                'input_type' => $attr[3],
                'is_active' => $attr[4],
                'sort_order' => $attr[5],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') === false) {
                throw $e;
            }
        }
    }
    
    // Step 4: Add monster attributes  
    echo "4. Adding monster attributes...\n";
    $monsterAttributes = [
        ['monster', 'monster_type', 'Monster Type', 'select', true, 10],
        ['monster', 'size', 'Size', 'select', true, 20],
        ['monster', 'threat_level', 'Threat Level', 'select', true, 30],
        ['monster', 'habitat', 'Habitat', 'select', true, 40],
        ['monster', 'special_abilities', 'Special Abilities', 'multi-select', true, 50],
        ['monster', 'body_type', 'Body Type', 'select', true, 60],
        ['monster', 'coloration', 'Coloration', 'select', true, 70],
        ['monster', 'artistic_style', 'Art Style', 'select', true, 80],
        ['monster', 'environment', 'Environment', 'select', true, 90]
    ];
    
    foreach ($monsterAttributes as $attr) {
        try {
            DB::table('attribute_config')->insert([
                'generator_type' => $attr[0],
                'category' => $attr[1],
                'label' => $attr[2],
                'input_type' => $attr[3],
                'is_active' => $attr[4],
                'sort_order' => $attr[5],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') === false) {
                throw $e;
            }
        }
    }
    
    // Step 5: Add race attributes
    echo "5. Adding race attributes...\n";
    $raceAttributes = [
        ['race', 'races', 'Race', 'select', true, 10],
        ['race', 'classes', 'Class', 'select', true, 20],
        ['race', 'experience_levels', 'Experience Level', 'select', true, 30],
        ['race', 'gender', 'Gender', 'select', true, 40],
        ['race', 'artistic_style', 'Art Style', 'select', true, 50],
        ['race', 'environment', 'Environment', 'select', true, 60],
        ['race', 'hair_colors', 'Hair Color', 'select', true, 70],
        ['race', 'skin_colors', 'Skin Color', 'select', true, 80],
        ['race', 'eye_colors', 'Eye Color', 'select', true, 90],
        ['race', 'eye_styles', 'Eye Style', 'select', true, 100]
    ];
    
    foreach ($raceAttributes as $attr) {
        try {
            DB::table('attribute_config')->insert([
                'generator_type' => $attr[0],
                'category' => $attr[1],
                'label' => $attr[2],
                'input_type' => $attr[3],
                'is_active' => $attr[4],
                'sort_order' => $attr[5],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            if (strpos($e->getMessage(), 'Duplicate entry') === false) {
                throw $e;
            }
        }
    }
    
    echo "\n✅ Migration completed successfully!\n";
    
    // Display summary
    $counts = DB::table('attribute_config')
        ->select('generator_type', DB::raw('COUNT(*) as count'))
        ->groupBy('generator_type')
        ->get();
        
    echo "\nAttribute counts by generator type:\n";
    foreach ($counts as $count) {
        echo "- {$count->generator_type}: {$count->count} attributes\n";
    }
    
} catch (\Exception $e) {
    echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}