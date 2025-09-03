<?php

require_once __DIR__ . '/../vendor/autoload.php';

use PDO;
use PDOException;

echo "Starting Game Assets Database Initialization...\n";

// Database configuration - adjust as needed
$host = 'localhost';
$dbname = 'prompt_gen';
$username = 'root';
$password = '';

try {
    // Use SQLite for development
    $sqliteDb = __DIR__ . '/../database/anime_prompt_gen.sqlite';
    $dsn = "sqlite:$sqliteDb";
    $pdo = new PDO($dsn, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    echo "✓ SQLite database connection established\n";

    // Read and execute the SQL migration
    $sqlFile = __DIR__ . '/../database/migrations/create_game_assets_table.sql';
    
    if (!file_exists($sqlFile)) {
        throw new Exception("Migration file not found: $sqlFile");
    }

    $sql = file_get_contents($sqlFile);
    
    // Split by semicolons and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement)) {
            try {
                $pdo->exec($statement);
                echo "✓ Executed SQL statement\n";
            } catch (PDOException $e) {
                // Ignore errors for statements that might already exist
                if (strpos($e->getMessage(), 'already exists') === false && 
                    strpos($e->getMessage(), 'Duplicate entry') === false) {
                    echo "⚠ Warning: " . $e->getMessage() . "\n";
                }
            }
        }
    }

    // Verify the table was created and data inserted
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM game_assets");
    $result = $stmt->fetch();
    
    echo "✓ Game assets table initialized with {$result['total']} entries\n";

    // Show breakdown by type
    $stmt = $pdo->query("SELECT type, COUNT(*) as count FROM game_assets GROUP BY type ORDER BY type");
    
    echo "\nAsset breakdown:\n";
    while ($row = $stmt->fetch()) {
        echo "  - {$row['type']}: {$row['count']} items\n";
    }

    echo "\n✅ Game Assets Database Initialization Complete!\n";

} catch (PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
    exit(1);
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\nNext steps:\n";
echo "1. Update your dependency injection container to include GameAssetRepository\n";
echo "2. Add routes for the new GameAssetsController endpoints\n";
echo "3. Test the alien generation with database-driven assets\n";
echo "4. Consider moving other hardcoded constants to the database\n";