<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('species', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('type'); // animalGirl, monster, monsterGirl
            $table->string('species_name')->nullable();
            $table->text('ears')->nullable();
            $table->text('tail')->nullable();
            $table->text('wings')->nullable();
            $table->json('features')->nullable();
            $table->json('personality')->nullable();
            $table->text('negative_prompt')->nullable();
            $table->text('description_template')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['type', 'is_active']);
        });
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('species');
    }
};
