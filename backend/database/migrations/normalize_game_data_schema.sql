-- Database normalization migration
-- Consolidates game_assets, attributes, species, and alien_species into a unified schema
-- Following backend standards with proper indexing and relationships

-- Drop old game_assets table if exists (will be replaced with normalized structure)
DROP TABLE IF EXISTS game_assets;

-- Normalize attributes table to be more generic and comprehensive
-- This will serve as the main repository for all categorical game data
ALTER TABLE attributes RENAME TO game_attributes;

-- Add missing columns to support all game data types
ALTER TABLE game_attributes ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'attribute';
ALTER TABLE game_attributes ADD COLUMN IF NOT EXISTS description TEXT NULL;
ALTER TABLE game_attributes ADD COLUMN IF NOT EXISTS parent_category TEXT NULL;
ALTER TABLE game_attributes ADD COLUMN IF NOT EXISTS created_at TEXT DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE game_attributes ADD COLUMN IF NOT EXISTS updated_at TEXT DEFAULT CURRENT_TIMESTAMP;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_attributes_type ON game_attributes (type);
CREATE INDEX IF NOT EXISTS idx_game_attributes_category ON game_attributes (category);
CREATE INDEX IF NOT EXISTS idx_game_attributes_type_category ON game_attributes (type, category);
CREATE INDEX IF NOT EXISTS idx_game_attributes_active ON game_attributes (is_active);
CREATE INDEX IF NOT EXISTS idx_game_attributes_weight ON game_attributes (weight);

-- Create unified species table that can handle both anime species and alien species
CREATE TABLE IF NOT EXISTS unified_species (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('anime', 'alien', 'fantasy', 'sci_fi')),
    category TEXT NOT NULL DEFAULT 'standard',
    description TEXT NULL,
    
    -- Physical characteristics
    ears TEXT NULL,
    tail TEXT NULL, 
    wings TEXT NULL,
    features TEXT NULL, -- JSON array
    
    -- Personality and behavior
    personality TEXT NULL, -- JSON array
    key_traits TEXT NULL, -- JSON array
    
    -- Visual descriptors  
    visual_descriptors TEXT NULL, -- JSON array
    physical_features TEXT NULL, -- JSON array
    
    -- Template and generation data
    description_template TEXT NULL,
    negative_prompt TEXT NULL,
    ai_prompt_elements TEXT NULL,
    
    -- Metadata
    is_active BOOLEAN NOT NULL DEFAULT 1,
    weight INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for unified species
CREATE INDEX IF NOT EXISTS idx_unified_species_type ON unified_species (type);
CREATE INDEX IF NOT EXISTS idx_unified_species_category ON unified_species (type, category);
CREATE INDEX IF NOT EXISTS idx_unified_species_active ON unified_species (is_active);
CREATE INDEX IF NOT EXISTS idx_unified_species_weight ON unified_species (weight);
CREATE UNIQUE INDEX IF NOT EXISTS unique_species_name_type ON unified_species (name, type);

-- Migrate existing species data to unified table
INSERT OR IGNORE INTO unified_species (
    name, type, category, description, ears, tail, wings, features, 
    personality, description_template, negative_prompt, is_active, created_at, updated_at
)
SELECT 
    name, 
    COALESCE(type, 'anime') as type,
    'standard' as category,
    NULL as description,
    ears, tail, wings, features, personality, 
    description_template, negative_prompt,
    COALESCE(is_active, 1) as is_active,
    COALESCE(created_at, CURRENT_TIMESTAMP) as created_at,
    COALESCE(updated_at, CURRENT_TIMESTAMP) as updated_at
FROM species;

-- Migrate alien species data to unified table  
INSERT OR IGNORE INTO unified_species (
    name, type, category, description, features, key_traits, 
    visual_descriptors, physical_features, ai_prompt_elements, is_active, created_at, updated_at
)
SELECT 
    name,
    'alien' as type,
    COALESCE(class, 'standard') as category,
    NULL as description,
    features,
    key_traits,
    visual_descriptors,
    variations as physical_features, -- Map variations to physical_features
    ai_prompt_elements,
    1 as is_active,
    CURRENT_TIMESTAMP as created_at,
    CURRENT_TIMESTAMP as updated_at
FROM alien_species;

-- Insert comprehensive game attribute data
INSERT OR IGNORE INTO game_attributes (category, name, value, type, description, weight, is_active) VALUES

-- Climate data
('climate', 'continental', 'Continental', 'environment', 'Moderate temperature with high rainfall', 10, 1),
('climate', 'ocean', 'Ocean', 'environment', 'Water-dominated world with high humidity', 8, 1),
('climate', 'tropical', 'Tropical', 'environment', 'Hot and humid with abundant precipitation', 10, 1),
('climate', 'savanna', 'Savanna', 'environment', 'Grasslands with seasonal rainfall', 8, 1),
('climate', 'alpine', 'Alpine', 'environment', 'High altitude with low precipitation', 6, 1),
('climate', 'steppe', 'Steppe', 'environment', 'Semi-arid grasslands', 7, 1),
('climate', 'desert', 'Desert', 'environment', 'Arid with extreme temperature variations', 9, 1),
('climate', 'tundra', 'Tundra', 'environment', 'Frozen ground with minimal vegetation', 5, 1),
('climate', 'arctic', 'Arctic', 'environment', 'Permanently frozen polar regions', 4, 1),

-- Gender data
('gender', 'male', 'male', 'character', 'Male character', 10, 1),
('gender', 'female', 'female', 'character', 'Female character', 10, 1),

-- Artistic styles
('artistic_style', 'cyberpunk', 'cyberpunk', 'visual', 'High-tech, low-life aesthetic', 8, 1),
('artistic_style', 'fantasy', 'fantasy', 'visual', 'Magical and mythical themes', 10, 1),
('artistic_style', 'realistic', 'realistic', 'visual', 'Photorealistic representation', 9, 1),
('artistic_style', 'surreal', 'surreal', 'visual', 'Dreamlike and abstract', 6, 1),
('artistic_style', 'biomechanical', 'biomechanical', 'visual', 'Fusion of organic and mechanical', 7, 1),
('artistic_style', 'retro-futuristic', 'retro-futuristic', 'visual', 'Vintage vision of the future', 6, 1),
('artistic_style', 'minimalist', 'minimalist', 'visual', 'Clean and simple design', 5, 1),
('artistic_style', 'baroque', 'baroque', 'visual', 'Ornate and dramatic style', 4, 1),

-- Environment settings
('environment', 'futuristic_cityscape', 'futuristic cityscape', 'setting', 'Advanced urban landscape', 8, 1),
('environment', 'alien_jungle', 'alien jungle', 'setting', 'Exotic extraterrestrial forest', 7, 1),
('environment', 'desolate_wasteland', 'desolate wasteland', 'setting', 'Barren post-apocalyptic terrain', 6, 1),
('environment', 'underwater_city', 'underwater city', 'setting', 'Submerged civilization', 5, 1),
('environment', 'orbital_space_station', 'orbital space station', 'setting', 'Artificial habitat in space', 7, 1),
('environment', 'volcanic_landscape', 'volcanic landscape', 'setting', 'Molten and rocky terrain', 6, 1),
('environment', 'crystalline_cavern', 'crystalline cavern', 'setting', 'Underground crystal formations', 5, 1),
('environment', 'floating_sky_islands', 'floating sky islands', 'setting', 'Aerial landmasses', 6, 1),
('environment', 'toxic_swamp', 'toxic swamp', 'setting', 'Poisonous wetlands', 4, 1),
('environment', 'ancient_ruins', 'ancient ruins', 'setting', 'Crumbling historical structures', 7, 1),

-- Cultural artifacts
('cultural_artifact', 'ceremonial_staff', 'ceremonial staff', 'item', 'Ritual weapon or tool', 6, 1),
('cultural_artifact', 'holographic_data_slate', 'holographic data slate', 'item', 'Advanced information device', 7, 1),
('cultural_artifact', 'glowing_amulet', 'glowing amulet', 'item', 'Mystical protective charm', 8, 1),
('cultural_artifact', 'intricate_blade', 'intricate blade', 'item', 'Ornately crafted weapon', 7, 1),
('cultural_artifact', 'tribal_mask', 'tribal mask', 'item', 'Traditional ceremonial face covering', 6, 1),
('cultural_artifact', 'bioluminescent_orb', 'bioluminescent orb', 'item', 'Living light source', 5, 1),
('cultural_artifact', 'ancient_relic', 'ancient relic', 'item', 'Mysterious historical artifact', 8, 1),
('cultural_artifact', 'futuristic_headset', 'futuristic headset', 'item', 'Advanced communication device', 6, 1),
('cultural_artifact', 'ornate_scepter', 'ornate scepter', 'item', 'Decorative symbol of authority', 5, 1),
('cultural_artifact', 'mechanical_prosthetic', 'mechanical prosthetic', 'item', 'Artificial body enhancement', 7, 1),

-- Experience levels
('experience_level', 'low', 'low', 'progression', 'Novice adventurer with basic skills', 10, 1),
('experience_level', 'mid', 'mid', 'progression', 'Experienced adventurer with proven abilities', 10, 1),
('experience_level', 'high', 'high', 'progression', 'Veteran adventurer with legendary skills', 8, 1);

-- Clean up old tables after successful migration
-- Note: Uncomment these lines after verifying migration worked correctly
-- DROP TABLE IF EXISTS species;
-- DROP TABLE IF EXISTS alien_species;

-- Create views for backward compatibility during transition period
CREATE VIEW IF NOT EXISTS species AS 
SELECT 
    id, name, type, ears, tail, wings, features, personality, 
    description_template, negative_prompt, is_active, created_at, updated_at
FROM unified_species 
WHERE type IN ('anime', 'fantasy');

CREATE VIEW IF NOT EXISTS alien_species AS
SELECT 
    id, name, category as class, 'alien' as form, 
    physical_features as variations, features, visual_descriptors, 
    key_traits, ai_prompt_elements
FROM unified_species 
WHERE type = 'alien';