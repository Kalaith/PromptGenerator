<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

return new class {
    public function up(): void
    {
        if (!Capsule::schema()->hasTable('adventurer_classes')) {
            Capsule::schema()->create('adventurer_classes', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->text('description')->nullable();
                $table->json('equipment_config')->nullable(); // Contains low/mid/high tier equipment
                $table->boolean('is_active')->default(true);
                $table->timestamps();

                $table->index(['is_active']);
            });
        }
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('adventurer_classes');
    }
};
