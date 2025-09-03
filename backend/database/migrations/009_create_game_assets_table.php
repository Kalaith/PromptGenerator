<?php

declare(strict_types=1);

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('game_assets', function (Blueprint $table) {
            $table->id();
            $table->string('type', 50)->index();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
            
            $table->index(['type', 'is_active']);
        });

        // Insert initial data
        $gameAssets = [
            // Experience Levels
            ['type' => 'experience_level', 'name' => 'low', 'description' => 'Beginner adventurer with basic skills'],
            ['type' => 'experience_level', 'name' => 'mid', 'description' => 'Experienced adventurer with developed abilities'],
            ['type' => 'experience_level', 'name' => 'high', 'description' => 'Master adventurer with exceptional skills'],
            
            // Genders
            ['type' => 'gender', 'name' => 'female', 'description' => 'Female character'],
            ['type' => 'gender', 'name' => 'male', 'description' => 'Male character'],
            ['type' => 'gender', 'name' => 'non-binary', 'description' => 'Non-binary character'],
            
            // Artistic Styles
            ['type' => 'artistic_style', 'name' => 'anime', 'description' => 'Japanese anime style'],
            ['type' => 'artistic_style', 'name' => 'manga', 'description' => 'Japanese manga style'],
            ['type' => 'artistic_style', 'name' => 'realistic', 'description' => 'Photorealistic style'],
            ['type' => 'artistic_style', 'name' => 'fantasy', 'description' => 'Fantasy art style'],
            ['type' => 'artistic_style', 'name' => 'chibi', 'description' => 'Cute chibi style'],
            ['type' => 'artistic_style', 'name' => 'semi-realistic', 'description' => 'Semi-realistic anime style'],
            ['type' => 'artistic_style', 'name' => 'watercolor', 'description' => 'Watercolor painting style'],
            ['type' => 'artistic_style', 'name' => 'digital_art', 'description' => 'Digital art style'],
            
            // Environments
            ['type' => 'environment', 'name' => 'forest', 'description' => 'Dense woodland environment'],
            ['type' => 'environment', 'name' => 'mountain', 'description' => 'Rocky mountain landscape'],
            ['type' => 'environment', 'name' => 'city', 'description' => 'Urban cityscape'],
            ['type' => 'environment', 'name' => 'dungeon', 'description' => 'Underground dungeon'],
            ['type' => 'environment', 'name' => 'beach', 'description' => 'Coastal beach setting'],
            ['type' => 'environment', 'name' => 'desert', 'description' => 'Arid desert landscape'],
            ['type' => 'environment', 'name' => 'castle', 'description' => 'Medieval castle setting'],
            ['type' => 'environment', 'name' => 'tavern', 'description' => 'Cozy tavern interior'],
            ['type' => 'environment', 'name' => 'library', 'description' => 'Ancient library setting'],
            ['type' => 'environment', 'name' => 'temple', 'description' => 'Sacred temple grounds'],
            ['type' => 'environment', 'name' => 'marketplace', 'description' => 'Bustling marketplace'],
            ['type' => 'environment', 'name' => 'ruins', 'description' => 'Ancient ruins'],
            
            // Fantasy Races
            ['type' => 'race', 'name' => 'human', 'description' => 'Human character'],
            ['type' => 'race', 'name' => 'elf', 'description' => 'Elven character with pointed ears'],
            ['type' => 'race', 'name' => 'dwarf', 'description' => 'Dwarven character, typically shorter and stocky'],
            ['type' => 'race', 'name' => 'halfling', 'description' => 'Small humanoid character'],
            ['type' => 'race', 'name' => 'dragonkin', 'description' => 'Dragon-like humanoid character'],
            ['type' => 'race', 'name' => 'tiefling', 'description' => 'Demonic heritage character with horns'],
            ['type' => 'race', 'name' => 'orc', 'description' => 'Orcish character with tusks'],
            ['type' => 'race', 'name' => 'gnome', 'description' => 'Small magical humanoid'],
            
            // Climates (for alien generation)
            ['type' => 'climate', 'name' => 'tropical', 'description' => 'Hot and humid climate'],
            ['type' => 'climate', 'name' => 'arctic', 'description' => 'Cold polar climate'],
            ['type' => 'climate', 'name' => 'desert', 'description' => 'Hot and dry climate'],
            ['type' => 'climate', 'name' => 'temperate', 'description' => 'Moderate climate'],
            ['type' => 'climate', 'name' => 'volcanic', 'description' => 'Hot volcanic environment'],
            ['type' => 'climate', 'name' => 'underwater', 'description' => 'Aquatic environment'],
            ['type' => 'climate', 'name' => 'space', 'description' => 'Zero gravity space environment'],
            
            // Cultural Artifacts
            ['type' => 'cultural_artifact', 'name' => 'scroll', 'description' => 'Ancient scroll with mystical writings'],
            ['type' => 'cultural_artifact', 'name' => 'amulet', 'description' => 'Magical protective amulet'],
            ['type' => 'cultural_artifact', 'name' => 'tome', 'description' => 'Ancient book of knowledge'],
            ['type' => 'cultural_artifact', 'name' => 'crystal', 'description' => 'Mystical crystal artifact'],
            ['type' => 'cultural_artifact', 'name' => 'rune_stone', 'description' => 'Stone carved with magical runes'],
            ['type' => 'cultural_artifact', 'name' => 'tribal_mask', 'description' => 'Traditional ceremonial mask'],
        ];

        foreach ($gameAssets as $asset) {
            Capsule::table('game_assets')->insert([
                'type' => $asset['type'],
                'name' => $asset['name'],
                'description' => $asset['description'],
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
        }
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('game_assets');
    }
};
