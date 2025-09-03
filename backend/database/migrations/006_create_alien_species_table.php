<?php

declare(strict_types=1);

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('alien_species', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('class');
            $table->text('form')->nullable();
            $table->json('variations')->nullable();
            $table->json('features')->nullable();
            $table->json('visual_descriptors')->nullable();
            $table->json('key_traits')->nullable();
            $table->text('ai_prompt_elements')->nullable();
            $table->timestamps();
            
            $table->index(['class']);
        });
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('alien_species');
    }
};