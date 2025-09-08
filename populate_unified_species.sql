-- ====================================================================
-- Unified Species Population Script
-- Populates unified_species table from existing species and alien_species data
-- Based on migration template pattern from normalize_game_data_schema_mysql.sql
-- ====================================================================

-- Disable foreign key checks for clean import
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Clear existing unified_species data if needed
-- TRUNCATE TABLE unified_species;

-- ====================================================================
-- STEP 1: Migrate anime/animal girl species from species table
-- ====================================================================

INSERT IGNORE INTO `unified_species` (
    `name`, `type`, `category`, `ears`, `tail`, `wings`, 
    `features`, `personality`, `key_traits`, `visual_descriptors`,
    `negative_prompt`, `ai_prompt_elements`, `is_active`, `weight`, 
    `created_at`, `updated_at`
)
SELECT 
    name,
    CASE 
        WHEN type = 'animalGirl' THEN 'animalGirl'
        WHEN type = 'monsterGirl' THEN 'monsterGirl'  
        WHEN type = 'monster' THEN 'monster'
        ELSE 'anime'
    END as type,
    'standard' as category,
    ears, tail, wings,
    -- Convert existing JSON arrays to proper format
    CASE WHEN features IS NOT NULL THEN features ELSE NULL END as features,
    CASE WHEN personality IS NOT NULL THEN personality ELSE NULL END as personality,
    -- Add default traits for anime species
    JSON_ARRAY('adaptable', 'resilient', 'distinctive') as key_traits,
    -- Create visual descriptors based on type
    CASE 
        WHEN type = 'animalGirl' AND ears LIKE '%cat%' THEN JSON_ARRAY('slender build, cat-like eyes, expressive tail')
        WHEN type = 'animalGirl' AND ears LIKE '%dog%' THEN JSON_ARRAY('athletic build, alert eyes, wagging tail')
        WHEN type = 'animalGirl' AND ears LIKE '%fox%' THEN JSON_ARRAY('elegant posture, intelligent eyes, flowing tails')
        WHEN type = 'monsterGirl' AND name = 'Slime' THEN JSON_ARRAY('translucent body, amorphous shape, glowing core')
        WHEN type = 'monsterGirl' AND name = 'Lamia' THEN JSON_ARRAY('serpentine lower body, hypnotic eyes, graceful coils')
        WHEN type = 'monsterGirl' AND name = 'Harpy' THEN JSON_ARRAY('feathered wings, sharp eyes, avian features')
        WHEN type = 'monster' AND name = 'Dragon' THEN JSON_ARRAY('imposing presence, scaled skin, powerful wings')
        WHEN type = 'monster' AND name = 'Golem' THEN JSON_ARRAY('massive stone construction, runic engravings, ancient presence')
        ELSE JSON_ARRAY('distinctive visual characteristics')
    END as visual_descriptors,
    negative_prompt,
    -- Generate AI prompt elements based on type and features
    CONCAT(
        CASE type
            WHEN 'animalGirl' THEN CONCAT('Anime-style ', species_name, ', ', COALESCE(ears, 'distinctive ears'))
            WHEN 'monsterGirl' THEN CONCAT('Fantasy ', species_name, ', unique creature features')
            WHEN 'monster' THEN CONCAT('Epic ', species_name, ', imposing presence')
            ELSE 'Anime character'
        END,
        CASE 
            WHEN wings IS NOT NULL THEN ', winged creature'
            WHEN tail IS NOT NULL THEN ', distinctive tail features'
            ELSE ''
        END
    ) as ai_prompt_elements,
    COALESCE(is_active, TRUE) as is_active,
    1 as weight,
    COALESCE(created_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at
FROM species 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'species' AND table_schema = DATABASE());

-- ====================================================================  
-- STEP 2: Migrate alien species data
-- ====================================================================

INSERT IGNORE INTO `unified_species` (
    `name`, `type`, `category`, `features`, `personality`, `key_traits`, 
    `visual_descriptors`, `physical_features`, `ai_prompt_elements`,
    `is_active`, `weight`, `created_at`, `updated_at`
)
SELECT 
    name,
    'alien' as type,
    COALESCE(`class`, 'standard') as category,
    -- Convert features array to JSON if not already
    CASE 
        WHEN features IS NOT NULL AND JSON_VALID(features) THEN CAST(features as JSON)
        WHEN features IS NOT NULL THEN JSON_ARRAY(features)
        ELSE JSON_ARRAY('elongated limbs and graceful proportions', 'diverse skin tones and markings', 'distinctive alien facial features')
    END as features,
    NULL as personality, -- Aliens don't have personality in the seeder
    -- Convert key_traits to JSON array
    CASE 
        WHEN key_traits IS NOT NULL AND JSON_VALID(key_traits) THEN CAST(key_traits as JSON)
        WHEN key_traits IS NOT NULL THEN JSON_ARRAY(key_traits)
        ELSE JSON_ARRAY('adaptive', 'intelligent', 'distinctive')
    END as key_traits,
    -- Convert visual_descriptors to JSON array  
    CASE
        WHEN visual_descriptors IS NOT NULL AND JSON_VALID(visual_descriptors) THEN CAST(visual_descriptors as JSON)
        WHEN visual_descriptors IS NOT NULL THEN JSON_ARRAY(visual_descriptors)
        ELSE JSON_ARRAY('diverse appearance', 'alien characteristics', 'unique physiology')
    END as visual_descriptors,
    -- Convert variations/physical_features to JSON array
    CASE
        WHEN variations IS NOT NULL AND JSON_VALID(variations) THEN CAST(variations as JSON)
        WHEN variations IS NOT NULL THEN JSON_ARRAY(variations)
        ELSE NULL
    END as physical_features,
    COALESCE(ai_prompt_elements, CONCAT(name, ' alien, distinctive alien features, futuristic aesthetic')) as ai_prompt_elements,
    TRUE as is_active,
    1 as weight,
    NOW() as created_at,
    NOW() as updated_at
FROM alien_species
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alien_species' AND table_schema = DATABASE());

-- ====================================================================
-- STEP 3: Add basic race species (from attributes table race category)
-- ====================================================================

INSERT IGNORE INTO `unified_species` (
    `name`, `type`, `category`, `features`, `personality`, `key_traits`,
    `visual_descriptors`, `ears`, `ai_prompt_elements`, `is_active`, `weight`,
    `created_at`, `updated_at`
)
VALUES 
-- Human baseline
('human', 'race', 'standard', 
 JSON_ARRAY('distinctive physical characteristics', 'unique cultural traits'),
 NULL,
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('versatile appearance, varied clothing, adaptable features'),
 NULL,
 NULL,
 TRUE, 1, NOW(), NOW()),

-- Elf
('elf', 'race', 'standard',
 JSON_ARRAY('graceful features', 'ethereal beauty', 'slender build'),
 JSON_ARRAY('wise', 'graceful', 'nature-loving', 'patient'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('slender build, pointed ears, ethereal beauty'),
 'long pointed elven ears',
 NULL,
 TRUE, 1, NOW(), NOW()),

-- Dwarf  
('dwarf', 'race', 'standard',
 JSON_ARRAY('sturdy build', 'beard', 'strong hands'),
 JSON_ARRAY('sturdy', 'determined', 'craftsman', 'loyal'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('stocky build, braided beard, sturdy features'),
 'human-like ears',
 NULL,
 TRUE, 1, NOW(), NOW()),

-- Halfling
('halfling', 'race', 'standard',
 JSON_ARRAY('distinctive physical characteristics', 'unique cultural traits'),
 NULL,
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('distinctive visual characteristics'),
 NULL,
 NULL,
 TRUE, 1, NOW(), NOW());

-- ====================================================================
-- STEP 4: Create summary statistics
-- ====================================================================

-- Show population results
SELECT 
    type,
    category,
    COUNT(*) as species_count
FROM unified_species 
GROUP BY type, category
ORDER BY type, category;

-- Show total count
SELECT COUNT(*) as total_unified_species FROM unified_species;

-- ====================================================================
-- STEP 5: Create indexes for performance (if not already created)
-- ====================================================================

-- These indexes should already exist from create2.sql, but adding for safety
CREATE INDEX IF NOT EXISTS idx_unified_species_name ON unified_species (name);
CREATE INDEX IF NOT EXISTS idx_unified_species_type_active ON unified_species (type, is_active);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- Population completed
-- ====================================================================

SELECT 'Unified species population completed successfully' as status;
SELECT CONCAT('Total species migrated: ', COUNT(*)) as result FROM unified_species;