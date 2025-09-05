<?php

declare(strict_types=1);

namespace AnimePromptGen\Tests\Unit;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    public function testBasicAssertion(): void
    {
        $this->assertTrue(true);
    }

    public function testArrayOperations(): void
    {
        $array = ['kemonomimi', 'monster-girl', 'monster'];
        
        $this->assertCount(3, $array);
        $this->assertContains('kemonomimi', $array);
        $this->assertNotContains('alien', $array);
    }

    public function testStringOperations(): void
    {
        $generatorType = 'kemonomimi';
        
        $this->assertIsString($generatorType);
        $this->assertEquals('kemonomimi', $generatorType);
        $this->assertStringContainsString('kemo', $generatorType);
    }
}