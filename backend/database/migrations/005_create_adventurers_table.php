<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Capsule\Manager as Capsule;

return new class {
    public function up(): void
    {
        Capsule::schema()->create('adventurers', function (Blueprint $table) {
            $table->id();
            $table->string('race');
            $table->unsignedBigInteger('class_id');
            $table->string('experience_level'); // low, mid, high
            $table->json('race_traits')->nullable();
            $table->json('generated_equipment')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('class_id')->references('id')->on('adventurer_classes')->onDelete('cascade');
            $table->index(['race']);
            $table->index(['experience_level']);
        });
    }

    public function down(): void
    {
        Capsule::schema()->dropIfExists('adventurers');
    }
};
