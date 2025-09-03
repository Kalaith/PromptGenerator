# Game Assets Database Migration

## Overview
This migration moves hardcoded constants from the `AlienGenerationService` to a proper database structure for better data management and maintainability.

## What Was Changed

### Before (Hardcoded Constants):
```php
private const CLIMATES = [
    'wet' => ['Continental', 'Ocean', 'Tropical'],
    'dry' => ['Savanna', 'Alpine', 'Steppe'],
    'cold' => ['Desert', 'Tundra', 'Arctic']
];

private const GENDERS = ['male', 'female'];
private const ARTISTIC_STYLES = ['cyberpunk', 'fantasy', 'realistic', ...];
// etc.
```

### After (Database-Driven):
- All game assets stored in `game_assets` table
- Proper model (`GameAsset`) and repository (`GameAssetRepository`)
- Weighted random selection support
- Easy to add/modify assets via database

## Files Added

1. **Models/GameAsset.php** - Data model for game assets
2. **External/GameAssetRepository.php** - Database access layer
3. **Controllers/GameAssetsController.php** - API endpoints for asset management
4. **database/migrations/create_game_assets_table.sql** - Database schema
5. **scripts/init-game-assets.php** - Initialization script

## Files Modified

1. **Services/AlienGenerationService.php** - Updated to use database instead of constants
2. **Controllers/AlienController.php** - Added methods to expose available options

## Database Schema

```sql
CREATE TABLE game_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('climate', 'gender', 'artistic_style', 'environment', 'cultural_artifact') NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    weight INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Benefits

### ✅ **Data Management**
- Assets can be added/modified without code deployment
- Support for weighted random selection
- Easy to disable assets via `is_active` flag
- Proper categorization and organization

### ✅ **Scalability**
- No hardcoded limits on number of assets
- Database indexing for fast queries
- Support for additional metadata (descriptions, weights)

### ✅ **Maintainability**
- Single source of truth for all game data
- Proper separation of code and data
- Easy to add new asset types

### ✅ **Admin Control**
- Assets can be managed via admin interface
- Real-time changes without server restart
- Analytics on asset usage through database

## Installation Steps

1. **Run the database migration:**
   ```bash
   php scripts/init-game-assets.php
   ```

2. **Update dependency injection container** to include:
   ```php
   $container[GameAssetRepository::class] = function ($container) {
       return new GameAssetRepository($container[PDO::class]);
   };
   ```

3. **Add routes** for asset management:
   ```php
   $app->get('/api/assets/{type}', [GameAssetsController::class, 'getAssetsByType']);
   $app->get('/api/assets/{type}/categories', [GameAssetsController::class, 'getCategoriesByType']);
   ```

4. **Update service dependencies** to inject `GameAssetRepository`

## API Endpoints

- `GET /api/assets/climate` - Get all climate options
- `GET /api/assets/gender` - Get all gender options  
- `GET /api/assets/artistic_style` - Get all artistic styles
- `GET /api/assets/environment` - Get all environments
- `GET /api/assets/cultural_artifact` - Get all cultural artifacts

## Future Enhancements

1. **Admin Interface** - Web UI for managing assets
2. **Import/Export** - Bulk asset management
3. **Usage Analytics** - Track which assets are most popular
4. **Localization** - Multi-language asset names
5. **Asset Relationships** - Dependencies between assets