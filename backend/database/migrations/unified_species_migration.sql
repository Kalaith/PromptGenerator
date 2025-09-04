-- Unified Species Migration for MySQL
-- Creates unified_species table and migrates data from existing species tables
-- Removes race data from attributes table as it belongs in species

-- Step 1: Create unified_species table
CREATE TABLE IF NOT EXISTS prompt_gen.unified_species (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('anime', 'alien', 'fantasy', 'sci_fi', 'race') NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'standard',
    description TEXT NULL,
    
    -- Physical characteristics
    ears TEXT NULL,
    tail TEXT NULL, 
    wings TEXT NULL,
    features JSON NULL,
    
    -- Personality and behavior
    personality JSON NULL,
    key_traits JSON NULL,
    
    -- Visual descriptors  
    visual_descriptors JSON NULL,
    physical_features JSON NULL,
    
    -- Template and generation data
    description_template TEXT NULL,
    negative_prompt TEXT NULL,
    ai_prompt_elements TEXT NULL,
    
    -- Metadata
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    weight INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_unified_species_type (type),
    INDEX idx_unified_species_category (type, category),
    INDEX idx_unified_species_active (is_active),
    INDEX idx_unified_species_weight (weight),
    UNIQUE INDEX unique_species_name_type (name, type)
);

-- Step 2: Migrate existing species data if table exists
INSERT IGNORE INTO prompt_gen.unified_species (
    name, type, category, description, ears, tail, wings, features, 
    personality, description_template, negative_prompt, is_active, created_at, updated_at
)
SELECT 
    name, 
    COALESCE(type, 'anime') as type,
    'standard' as category,
    NULL as description,
    ears, tail, wings, 
    CASE WHEN features IS NOT NULL AND features != '' THEN JSON_ARRAY(features) ELSE NULL END as features,
    CASE WHEN personality IS NOT NULL AND personality != '' THEN JSON_ARRAY(personality) ELSE NULL END as personality,
    description_template, negative_prompt,
    COALESCE(is_active, TRUE) as is_active,
    COALESCE(created_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at
FROM prompt_gen.species
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'species' AND table_schema = 'prompt_gen');

-- Step 3: Migrate alien species data if table exists  
INSERT IGNORE INTO prompt_gen.unified_species (
    name, type, category, description, features, key_traits, 
    visual_descriptors, physical_features, ai_prompt_elements, is_active, created_at, updated_at
)
SELECT 
    name,
    'alien' as type,
    COALESCE(`class`, 'standard') as category,
    NULL as description,
    CASE WHEN features IS NOT NULL AND features != '' THEN CAST(features as JSON) ELSE NULL END as features,
    CASE WHEN key_traits IS NOT NULL AND key_traits != '' THEN CAST(key_traits as JSON) ELSE NULL END as key_traits,
    CASE WHEN visual_descriptors IS NOT NULL AND visual_descriptors != '' THEN CAST(visual_descriptors as JSON) ELSE NULL END as visual_descriptors,
    CASE WHEN variations IS NOT NULL AND variations != '' THEN CAST(variations as JSON) ELSE NULL END as physical_features,
    ai_prompt_elements,
    TRUE as is_active,
    NOW() as created_at,
    NOW() as updated_at
FROM prompt_gen.alien_species
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alien_species' AND table_schema = 'prompt_gen');

-- Step 4: Migrate race data from attributes to unified_species
INSERT IGNORE INTO prompt_gen.unified_species (
    name, type, category, description, weight, is_active, created_at, updated_at
)
SELECT 
    value as name,
    'race' as type,
    'standard' as category,
    description,
    COALESCE(weight, 1) as weight,
    COALESCE(is_active, TRUE) as is_active,
    COALESCE(created_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at
FROM prompt_gen.attributes
WHERE category = 'race' OR type = 'species';

-- Step 5: Remove race/species entries from attributes table
DELETE FROM prompt_gen.attributes 
WHERE category = 'race' OR type = 'species';

-- Step 6: Create backward compatibility views
CREATE OR REPLACE VIEW prompt_gen.species AS 
SELECT 
    id, name, type, ears, tail, wings, 
    CASE WHEN features IS NOT NULL THEN JSON_UNQUOTE(features) ELSE NULL END as features,
    CASE WHEN personality IS NOT NULL THEN JSON_UNQUOTE(personality) ELSE NULL END as personality,
    description_template, negative_prompt, is_active, created_at, updated_at
FROM prompt_gen.unified_species 
WHERE type IN ('anime', 'fantasy', 'race');

CREATE OR REPLACE VIEW prompt_gen.alien_species AS
SELECT 
    id, name, category as `class`, 'alien' as form, 
    CASE WHEN physical_features IS NOT NULL THEN JSON_UNQUOTE(physical_features) ELSE NULL END as variations,
    CASE WHEN features IS NOT NULL THEN JSON_UNQUOTE(features) ELSE NULL END as features,
    CASE WHEN visual_descriptors IS NOT NULL THEN JSON_UNQUOTE(visual_descriptors) ELSE NULL END as visual_descriptors,
    CASE WHEN key_traits IS NOT NULL THEN JSON_UNQUOTE(key_traits) ELSE NULL END as key_traits,
    ai_prompt_elements
FROM prompt_gen.unified_species 
WHERE type = 'alien';

-- Step 7: Add indexes for performance
CREATE INDEX idx_unified_species_name ON prompt_gen.unified_species (name);
CREATE INDEX idx_unified_species_type_active ON prompt_gen.unified_species (type, is_active);

-- Migration completed
SELECT 'Unified species migration completed successfully' as status;