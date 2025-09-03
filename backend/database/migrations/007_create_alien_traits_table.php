<?php

declare(strict_types=1);

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('alien_traits', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['positive', 'negative']);
            $table->text('effect')->nullable();
            $table->json('visual_descriptors')->nullable();
            $table->timestamps();
            
            $table->index(['type']);
        });
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('alien_traits');
    }
};