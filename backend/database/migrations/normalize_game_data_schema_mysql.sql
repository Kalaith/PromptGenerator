-- Database normalization migration for MySQL
-- Consolidates game_assets, attributes, species, and alien_species into a unified schema
-- Following backend standards with proper indexing and relationships

-- First, preserve existing data by migrating game_assets to attributes table
-- Check if game_assets table exists and migrate data before dropping it
INSERT IGNORE INTO prompt_gen.attributes (category, name, value, weight, is_active)
SELECT 
    type as category,
    name,
    name as value,
    COALESCE(weight, 1) as weight,
    COALESCE(is_active, TRUE) as is_active
FROM prompt_gen.game_assets

-- Now safe to drop game_assets table after data migration
DROP TABLE IF EXISTS game_assets;

-- Normalize attributes table to be more generic and comprehensive
-- This will serve as the main repository for all categorical game data
ALTER TABLE attributes RENAME TO game_attributes;

-- Add missing columns to support all game data types
ALTER TABLE game_attributes 
ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'attribute',
ADD COLUMN description TEXT NULL,
ADD COLUMN parent_category VARCHAR(100) NULL,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update type field for migrated game_assets data based on category
UPDATE game_attributes 
SET type = CASE 
    WHEN category = 'climate' THEN 'environment'
    WHEN category = 'gender' THEN 'character'
    WHEN category = 'artistic_style' THEN 'visual'
    WHEN category = 'environment' THEN 'setting'
    WHEN category = 'cultural_artifact' THEN 'item'
    WHEN category = 'experience_level' THEN 'progression'
    WHEN category = 'race' THEN 'species'
    ELSE 'attribute'
END
WHERE type = 'attribute';

-- Create indexes for performance
CREATE INDEX idx_game_attributes_type ON game_attributes (type);
CREATE INDEX idx_game_attributes_category ON game_attributes (category);
CREATE INDEX idx_game_attributes_type_category ON game_attributes (type, category);
CREATE INDEX idx_game_attributes_active ON game_attributes (is_active);
CREATE INDEX idx_game_attributes_weight ON game_attributes (weight);

-- Create unified species table that can handle both anime species and alien species
CREATE TABLE IF NOT EXISTS unified_species (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('anime', 'alien', 'fantasy', 'sci_fi') NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'standard',
    description TEXT NULL,
    
    -- Physical characteristics
    ears TEXT NULL,
    tail TEXT NULL, 
    wings TEXT NULL,
    features JSON NULL, -- JSON array
    
    -- Personality and behavior
    personality JSON NULL, -- JSON array
    key_traits JSON NULL, -- JSON array
    
    -- Visual descriptors  
    visual_descriptors JSON NULL, -- JSON array
    physical_features JSON NULL, -- JSON array
    
    -- Template and generation data
    description_template TEXT NULL,
    negative_prompt TEXT NULL,
    ai_prompt_elements TEXT NULL,
    
    -- Metadata
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    weight INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for unified species
CREATE INDEX idx_unified_species_type ON unified_species (type);
CREATE INDEX idx_unified_species_category ON unified_species (type, category);
CREATE INDEX idx_unified_species_active ON unified_species (is_active);
CREATE INDEX idx_unified_species_weight ON unified_species (weight);
CREATE UNIQUE INDEX unique_species_name_type ON unified_species (name, type);

-- Migrate existing species data to unified table (if species table exists)
INSERT IGNORE INTO unified_species (
    name, type, category, description, ears, tail, wings, features, 
    personality, description_template, negative_prompt, is_active, created_at, updated_at
)
SELECT 
    name, 
    COALESCE(type, 'anime') as type,
    'standard' as category,
    NULL as description,
    ears, tail, wings, 
    CASE WHEN features IS NOT NULL THEN JSON_ARRAY(features) ELSE NULL END as features,
    CASE WHEN personality IS NOT NULL THEN JSON_ARRAY(personality) ELSE NULL END as personality,
    description_template, negative_prompt,
    COALESCE(is_active, TRUE) as is_active,
    COALESCE(created_at, NOW()) as created_at,
    COALESCE(updated_at, NOW()) as updated_at
FROM species
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'species' AND table_schema = DATABASE());

-- Migrate alien species data to unified table (if alien_species table exists)  
INSERT IGNORE INTO unified_species (
    name, type, category, description, features, key_traits, 
    visual_descriptors, physical_features, ai_prompt_elements, is_active, created_at, updated_at
)
SELECT 
    name,
    'alien' as type,
    COALESCE(class, 'standard') as category,
    NULL as description,
    CASE WHEN features IS NOT NULL THEN CAST(features as JSON) ELSE NULL END as features,
    CASE WHEN key_traits IS NOT NULL THEN CAST(key_traits as JSON) ELSE NULL END as key_traits,
    CASE WHEN visual_descriptors IS NOT NULL THEN CAST(visual_descriptors as JSON) ELSE NULL END as visual_descriptors,
    CASE WHEN variations IS NOT NULL THEN CAST(variations as JSON) ELSE NULL END as physical_features,
    ai_prompt_elements,
    TRUE as is_active,
    NOW() as created_at,
    NOW() as updated_at
FROM alien_species
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alien_species' AND table_schema = DATABASE());

-- Insert comprehensive game attribute data
INSERT IGNORE INTO game_attributes (category, name, value, type, description, weight, is_active) VALUES

-- Climate data
('climate', 'continental', 'Continental', 'environment', 'Moderate temperature with high rainfall', 10, TRUE),
('climate', 'ocean', 'Ocean', 'environment', 'Water-dominated world with high humidity', 8, TRUE),
('climate', 'tropical', 'Tropical', 'environment', 'Hot and humid with abundant precipitation', 10, TRUE),
('climate', 'savanna', 'Savanna', 'environment', 'Grasslands with seasonal rainfall', 8, TRUE),
('climate', 'alpine', 'Alpine', 'environment', 'High altitude with low precipitation', 6, TRUE),
('climate', 'steppe', 'Steppe', 'environment', 'Semi-arid grasslands', 7, TRUE),
('climate', 'desert', 'Desert', 'environment', 'Arid with extreme temperature variations', 9, TRUE),
('climate', 'tundra', 'Tundra', 'environment', 'Frozen ground with minimal vegetation', 5, TRUE),
('climate', 'arctic', 'Arctic', 'environment', 'Permanently frozen polar regions', 4, TRUE),

-- Gender data
('gender', 'male', 'male', 'character', 'Male character', 10, TRUE),
('gender', 'female', 'female', 'character', 'Female character', 10, TRUE),

-- Artistic styles
('artistic_style', 'cyberpunk', 'cyberpunk', 'visual', 'High-tech, low-life aesthetic', 8, TRUE),
('artistic_style', 'fantasy', 'fantasy', 'visual', 'Magical and mythical themes', 10, TRUE),
('artistic_style', 'realistic', 'realistic', 'visual', 'Photorealistic representation', 9, TRUE),
('artistic_style', 'surreal', 'surreal', 'visual', 'Dreamlike and abstract', 6, TRUE),
('artistic_style', 'biomechanical', 'biomechanical', 'visual', 'Fusion of organic and mechanical', 7, TRUE),
('artistic_style', 'retro-futuristic', 'retro-futuristic', 'visual', 'Vintage vision of the future', 6, TRUE),
('artistic_style', 'minimalist', 'minimalist', 'visual', 'Clean and simple design', 5, TRUE),
('artistic_style', 'baroque', 'baroque', 'visual', 'Ornate and dramatic style', 4, TRUE),

-- Environment settings
('environment', 'futuristic_cityscape', 'futuristic cityscape', 'setting', 'Advanced urban landscape', 8, TRUE),
('environment', 'alien_jungle', 'alien jungle', 'setting', 'Exotic extraterrestrial forest', 7, TRUE),
('environment', 'desolate_wasteland', 'desolate wasteland', 'setting', 'Barren post-apocalyptic terrain', 6, TRUE),
('environment', 'underwater_city', 'underwater city', 'setting', 'Submerged civilization', 5, TRUE),
('environment', 'orbital_space_station', 'orbital space station', 'setting', 'Artificial habitat in space', 7, TRUE),
('environment', 'volcanic_landscape', 'volcanic landscape', 'setting', 'Molten and rocky terrain', 6, TRUE),
('environment', 'crystalline_cavern', 'crystalline cavern', 'setting', 'Underground crystal formations', 5, TRUE),
('environment', 'floating_sky_islands', 'floating sky islands', 'setting', 'Aerial landmasses', 6, TRUE),
('environment', 'toxic_swamp', 'toxic swamp', 'setting', 'Poisonous wetlands', 4, TRUE),
('environment', 'ancient_ruins', 'ancient ruins', 'setting', 'Crumbling historical structures', 7, TRUE),

-- Cultural artifacts
('cultural_artifact', 'ceremonial_staff', 'ceremonial staff', 'item', 'Ritual weapon or tool', 6, TRUE),
('cultural_artifact', 'holographic_data_slate', 'holographic data slate', 'item', 'Advanced information device', 7, TRUE),
('cultural_artifact', 'glowing_amulet', 'glowing amulet', 'item', 'Mystical protective charm', 8, TRUE),
('cultural_artifact', 'intricate_blade', 'intricate blade', 'item', 'Ornately crafted weapon', 7, TRUE),
('cultural_artifact', 'tribal_mask', 'tribal mask', 'item', 'Traditional ceremonial face covering', 6, TRUE),
('cultural_artifact', 'bioluminescent_orb', 'bioluminescent orb', 'item', 'Living light source', 5, TRUE),
('cultural_artifact', 'ancient_relic', 'ancient relic', 'item', 'Mysterious historical artifact', 8, TRUE),
('cultural_artifact', 'futuristic_headset', 'futuristic headset', 'item', 'Advanced communication device', 6, TRUE),
('cultural_artifact', 'ornate_scepter', 'ornate scepter', 'item', 'Decorative symbol of authority', 5, TRUE),
('cultural_artifact', 'mechanical_prosthetic', 'mechanical prosthetic', 'item', 'Artificial body enhancement', 7, TRUE),

-- Experience levels
('experience_level', 'low', 'low', 'progression', 'Novice adventurer with basic skills', 10, TRUE),
('experience_level', 'mid', 'mid', 'progression', 'Experienced adventurer with proven abilities', 10, TRUE),
('experience_level', 'high', 'high', 'progression', 'Veteran adventurer with legendary skills', 8, TRUE);

-- Create views for backward compatibility during transition period
CREATE OR REPLACE VIEW species AS 
SELECT 
    id, name, type, ears, tail, wings, 
    CASE WHEN features IS NOT NULL THEN JSON_UNQUOTE(features) ELSE NULL END as features,
    CASE WHEN personality IS NOT NULL THEN JSON_UNQUOTE(personality) ELSE NULL END as personality,
    description_template, negative_prompt, is_active, created_at, updated_at
FROM unified_species 
WHERE type IN ('anime', 'fantasy');

CREATE OR REPLACE VIEW alien_species AS
SELECT 
    id, name, category as class, 'alien' as form, 
    CASE WHEN physical_features IS NOT NULL THEN JSON_UNQUOTE(physical_features) ELSE NULL END as variations,
    CASE WHEN features IS NOT NULL THEN JSON_UNQUOTE(features) ELSE NULL END as features,
    CASE WHEN visual_descriptors IS NOT NULL THEN JSON_UNQUOTE(visual_descriptors) ELSE NULL END as visual_descriptors,
    CASE WHEN key_traits IS NOT NULL THEN JSON_UNQUOTE(key_traits) ELSE NULL END as key_traits,
    ai_prompt_elements
FROM unified_species 
WHERE type = 'alien';

-- Clean up old tables after successful migration
-- Note: Uncomment these lines after verifying migration worked correctly
-- DROP TABLE IF EXISTS species;
-- DROP TABLE IF EXISTS alien_species;