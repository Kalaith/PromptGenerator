# Anime Prompt Generator - Database Schema Documentation

## Overview
This document describes all database tables used in the Anime Prompt Generator application, based on analysis of the codebase models, controllers, and services.

## Database Configuration
- **Primary Database**: MySQL (default) with UTF8MB4 charset
- **Alternative**: SQLite support available
- **Connection**: Managed via Illuminate Database (Eloquent ORM)
- **Default Database Name**: `prompt_gen`

## Core Tables

### `generator_types`
**Purpose**: Dynamic configuration for different generator types  
**Model**: `GeneratorType.php`
- Replaces hardcoded generator type arrays throughout the application
- Defines available generator types (anime, alien, race, monster, etc.)
- Fields: `id`, `name`, `display_name`, `description`, `endpoint`, `route_key`, `is_active`, `sort_order`
- **Dynamic**: Allows adding new generator types without code changes
- **Integration**: Used by frontend navigation, attribute forms, and template systems

### `unified_species`
**Purpose**: Main species data for character generation across all generator types  
**Models**: `Species.php` (primary), `UnifiedSpecies.php` (alias)
- Contains animal girls, monsters, aliens, races, etc.
- Supports multiple types: `animalGirl`, `monster`, `monsterGirl`, `alien`, `race`
- Includes visual descriptors, personality traits, and physical features
- Enhanced with AI prompt elements, categorization, and weighted selection
- **Note**: Both `Species` and `UnifiedSpecies` models point to this same table

### `attributes`
**Purpose**: Dynamic attribute options for generators  
**Model**: `Attribute.php` / `GameAttribute.php`
- Stores customizable attributes like hair colors, eye colors, etc.
- Organized by category (e.g., 'hair_color', 'eye_color')
- Supports multiple generator types (anime, alien, adventurer)
- **Also contains game data**: environments, styles, artifacts, climates, etc.
- Replaces the need for separate `game_assets` table

### `attribute_config`
**Purpose**: Configuration for attribute categories per generator type  
**Referenced in**: `AttributeConfigController.php`
- Defines which attribute categories are available for each generator
- Controls display order and behavior
- Maps generator types to attribute categories

## Character Generation Tables

### `adventurer_classes`
**Purpose**: D&D-style character classes for adventurer generation  
**Model**: `AdventurerClass.php`
- Fighter, Wizard, Rogue, etc.
- Class-specific attributes and abilities  
- Used with `unified_species` (races) for complete adventurer generation

### `alien_traits`
**Purpose**: Specific traits and characteristics for aliens  
**Model**: `AlienTrait.php`
- Physical and cultural traits
- Used alongside `unified_species` (type='alien') for alien generation

## Content Generation Tables

### `prompts`
**Purpose**: Generated prompt text storage  
**Model**: `Prompt.php`
- Stores generated character prompts
- May include metadata and generation parameters

### `templates`
**Purpose**: Prompt generation templates  
**Model**: `Template.php`
- Template patterns for generating prompts
- Supports placeholder replacement and customization

### `description_templates`
**Purpose**: Templates specifically for character descriptions  
**Model**: `DescriptionTemplate.php`
- More specialized templates for character descriptions
- May include multiple template types

## Image Generation Tables

### `generated_images`
**Purpose**: Metadata for AI-generated images  
**Model**: `GeneratedImage.php`
- Image file paths, generation parameters
- Links to prompts or characters that generated them

### `image_generation_queue`
**Purpose**: Queue system for image generation requests  
**Model**: `ImageGenerationQueue.php`
- Manages asynchronous image generation
- Tracks generation status and progress

### `image_collections`
**Purpose**: Organized collections of related images  
**Model**: `ImageCollection.php`
- Groups images by theme, character type, etc.
- Supports gallery organization

## System Tables

### `user_sessions`
**Purpose**: User session management and preferences  
**Model**: `UserSession.php`
- Stores user preferences, favorites, history
- Session-based data for frontend state


## Table Relationships

### Primary Relationships:
- `unified_species` ↔ `attributes` (many-to-many via categories)
- Adventurer generation uses `adventurer_classes` + `unified_species` (no persistent storage)
- Alien generation uses `unified_species` (type='alien') + `alien_traits` (many-to-many)
- `generated_images` → `prompts` (foreign key)
- `image_generation_queue` → `generated_images` (one-to-one)

### Configuration Relationships:
- `generator_types` defines available generator types dynamically
- `attribute_config` defines which `attributes` categories are available per generator
- `templates` and `description_templates` work together for prompt generation
- Generator types now support dynamic validation and field mapping

## Database Access Patterns

### Models (Eloquent ORM):
- All primary tables have corresponding Eloquent models
- Models handle relationships and data validation
- Located in `backend/src/Models/`

### Direct Database Access:
- Some controllers use `DB::table()` for complex queries
- Particularly for `attributes` and `attribute_config` tables
- Used for dynamic attribute management

### Repositories:
- External data access layer in `backend/src/External/`
- Provides abstraction over database operations
- Handles complex business logic queries

## Data Migration Notes

### Historical Changes:
- Game assets were migrated from hardcoded constants to database tables
- Species data was consolidated into unified structure
- Attribute system was made dynamic and configurable
- **Generator types converted from hardcoded arrays to database-driven system**

### Current State:
- All core functionality is database-driven
- No hardcoded character data or generator types in application code
- Supports runtime configuration changes for all generator aspects
- **Frontend navigation and forms now dynamically load from API**

## Database Sizing Considerations

### Large Tables:
- `unified_species`: 80+ species entries
- `attributes`: Potentially hundreds of attribute options
- `generated_images`: Grows with usage, could be very large
- `prompts`: Grows with generation requests

### Small Tables:
- `adventurer_classes`: ~12 standard D&D classes (no persistent adventurer data)
- `attribute_config`: Configuration entries only
- `templates` / `description_templates`: Limited template sets

## Environment Configuration

### Database Connection:
```env
DB_DRIVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=prompt_gen
DB_USERNAME=root
DB_PASSWORD=
DB_PREFIX=
```

### SQLite Alternative:
```env
DB_DRIVER=sqlite
DB_DATABASE=./database/anime_prompt_gen.sqlite
```

---

**Last Updated**: September 8, 2025  
**Total Tables Identified**: 14 tables (including new `generator_types`)  
**Primary Models**: 14 Eloquent models  
**Database Engine**: MySQL (primary), SQLite (alternative)  
**ORM**: Illuminate Database (Laravel's Eloquent)

**Notes**: 
- **NEW**: `generator_types` table replaces hardcoded arrays throughout application
- Adventurer generation uses `adventurer_classes` + `unified_species` without persistent storage
- Alien generation uses `unified_species` (type='alien') instead of separate `alien_species` table
- Game assets are stored in the `attributes` table, no separate `game_assets` table needed
- **API-Driven**: Frontend components now fetch generator types dynamically from backend