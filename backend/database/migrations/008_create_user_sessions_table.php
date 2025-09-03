<?php

declare(strict_types=1);

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('user_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();
            $table->json('favorites')->nullable(); // Array of prompt IDs
            $table->json('history')->nullable(); // Array of prompt objects with timestamps
            $table->json('preferences')->nullable(); // User preferences object
            $table->timestamps();
            
            $table->index(['session_id']);
        });
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('user_sessions');
    }
};