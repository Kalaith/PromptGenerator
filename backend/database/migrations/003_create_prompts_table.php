<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('prompts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('negative_prompt')->nullable();
            $table->json('tags')->nullable();
            $table->unsignedBigInteger('species_id')->nullable();
            $table->string('prompt_type'); // animalGirl, monster, monsterGirl, adventurer
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();

            $table->foreign('species_id')->references('id')->on('species')->onDelete('set null');
            $table->index(['prompt_type']);
            $table->index(['generated_at']);
        });
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('prompts');
    }
};
