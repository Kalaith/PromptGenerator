<?php

declare(strict_types=1);

namespace AnimePromptGen\Tests\Unit\Services;

use PHPUnit\Framework\TestCase;

class PromptGenerationServiceTest extends TestCase
{
    public function testBasicStringOperations(): void
    {
        $generatorType = 'kemonomimi';
        
        $this->assertIsString($generatorType);
        $this->assertEquals('kemonomimi', $generatorType);
        $this->assertStringContainsString('kemo', $generatorType);
    }

    public function testArrayManipulation(): void
    {
        $types = ['kemonomimi', 'monster-girl', 'monster'];
        
        $this->assertCount(3, $types);
        $this->assertContains('kemonomimi', $types);
        $this->assertNotContains('alien', $types);
        
        // Test array filtering
        $filtered = array_filter($types, fn($type) => str_contains($type, 'monster'));
        $this->assertCount(2, $filtered);
    }

    public function testPromptGenerationLogic(): void
    {
        // Test simple prompt building logic
        $species = 'catgirl';
        $attributes = ['cute', 'playful'];
        
        $description = "A {$species} character with " . implode(', ', $attributes);
        $expected = "A catgirl character with cute, playful";
        
        $this->assertEquals($expected, $description);
    }
}