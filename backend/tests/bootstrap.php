<?php

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

// Load test environment
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

// Set testing environment
$_ENV['APP_ENV'] = 'testing';
$_ENV['DB_DATABASE'] = ':memory:';