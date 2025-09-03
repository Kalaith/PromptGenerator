<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('attributes', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // hair_colors, eye_colors, backgrounds, etc.
            $table->string('name')->nullable();
            $table->string('value');
            $table->integer('weight')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['category', 'is_active']);
            $table->index(['weight']);
        });
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('attributes');
    }
};
