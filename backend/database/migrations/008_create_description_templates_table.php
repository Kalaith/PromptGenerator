<?php

declare(strict_types=1);

use Illuminate\Database\Capsule\Manager as Capsule;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('description_templates', function ($table) {
            $table->id();
            $table->string('name');
            $table->enum('generator_type', ['adventurer', 'alien', 'anime', 'base']);
            $table->text('template');
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            
            // Indexes
            $table->index(['generator_type']);
            $table->index(['is_active']);
            $table->index(['is_default']);
            $table->unique(['name', 'generator_type']);
        });

        // Insert default templates
        Capsule::table('description_templates')->insert([
            [
                'name' => 'Default Adventurer Template',
                'generator_type' => 'adventurer',
                'template' => 'A {race} {class} with {hairColor} hair, wearing {equipment}. {pronoun_subject_cap} has {personality} personality and specializes in {skills}.',
                'description' => 'Default template for adventurer character descriptions',
                'is_active' => true,
                'is_default' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Detailed Adventurer Template',
                'generator_type' => 'adventurer',
                'template' => 'Meet {name}, a {age}-year-old {race} {class} from {homeland}. With {hairColor} hair and {eyeColor} eyes, {pronoun_subject} stands {height} tall. {pronoun_subject_cap} wears {equipment} and carries {weapons}. Known for {pronoun_possessive} {personality} nature, {pronoun_subject} excels at {skills} and has a deep knowledge of {knowledge}.',
                'description' => 'Detailed template with extended character information',
                'is_active' => true,
                'is_default' => false,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Default Alien Template',
                'generator_type' => 'alien',
                'template' => 'A {species_class} alien from {climate} environments. {pronoun_subject_cap} has {trait} and {negativeTrait}. {pronoun_subject_cap} prefers {style} settings.',
                'description' => 'Default template for alien character descriptions',
                'is_active' => true,
                'is_default' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Detailed Alien Template',
                'generator_type' => 'alien',
                'template' => 'An ancient {species_class} being that evolved in {climate} conditions. This alien entity possesses {trait}, though it struggles with {negativeTrait}. {pronoun_subject_cap} thrives in {style} environments and has adapted to {environment} habitats over millennia.',
                'description' => 'Detailed alien template with evolutionary background',
                'is_active' => true,
                'is_default' => false,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ],
            [
                'name' => 'Default Anime Template', 
                'generator_type' => 'anime',
                'template' => 'A {species} character with {trait} characteristics. {pronoun_subject_cap} has a {personality} personality and {appearance} appearance.',
                'description' => 'Default template for anime character descriptions',
                'is_active' => true,
                'is_default' => true,
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ]);
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('description_templates');
    }
};
