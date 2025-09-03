-- Create game_assets table to store all game-related data
-- that was previously hardcoded in services

CREATE TABLE IF NOT EXISTS game_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('climate', 'gender', 'artistic_style', 'environment', 'cultural_artifact', 'race', 'experience_level')),
    category TEXT NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    weight INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_type ON game_assets (type);
CREATE INDEX IF NOT EXISTS idx_type_category ON game_assets (type, category);
CREATE INDEX IF NOT EXISTS idx_active ON game_assets (is_active);
CREATE UNIQUE INDEX IF NOT EXISTS unique_asset ON game_assets (name, type, category);

-- Insert default climate data
INSERT OR IGNORE INTO game_assets (name, type, category, description) VALUES
-- Wet climates
('Continental', 'climate', 'wet', 'Moderate temperature with high rainfall'),
('Ocean', 'climate', 'wet', 'Water-dominated world with high humidity'),
('Tropical', 'climate', 'wet', 'Hot and humid with abundant precipitation'),

-- Dry climates  
('Savanna', 'climate', 'dry', 'Grasslands with seasonal rainfall'),
('Alpine', 'climate', 'dry', 'High altitude with low precipitation'),
('Steppe', 'climate', 'dry', 'Semi-arid grasslands'),

-- Cold climates
('Desert', 'climate', 'cold', 'Arid with extreme temperature variations'),
('Tundra', 'climate', 'cold', 'Frozen ground with minimal vegetation'),
('Arctic', 'climate', 'cold', 'Permanently frozen polar regions');

-- Insert gender options
INSERT OR IGNORE INTO game_assets (name, type, category, description) VALUES
('male', 'gender', 'standard', 'Male character'),
('female', 'gender', 'standard', 'Female character');

-- Insert artistic styles
INSERT OR IGNORE INTO game_assets (name, type, category, description) VALUES
('cyberpunk', 'artistic_style', 'visual', 'High-tech, low-life aesthetic'),
('fantasy', 'artistic_style', 'visual', 'Magical and mythical themes'),
('realistic', 'artistic_style', 'visual', 'Photorealistic representation'),
('surreal', 'artistic_style', 'visual', 'Dreamlike and abstract'),
('biomechanical', 'artistic_style', 'visual', 'Fusion of organic and mechanical'),
('retro-futuristic', 'artistic_style', 'visual', 'Vintage vision of the future'),
('minimalist', 'artistic_style', 'visual', 'Clean and simple design'),
('baroque', 'artistic_style', 'visual', 'Ornate and dramatic style');

-- Insert environments
INSERT OR IGNORE INTO game_assets (name, type, category, description) VALUES
('futuristic cityscape', 'environment', 'setting', 'Advanced urban landscape'),
('alien jungle', 'environment', 'setting', 'Exotic extraterrestrial forest'),
('desolate wasteland', 'environment', 'setting', 'Barren post-apocalyptic terrain'),
('underwater city', 'environment', 'setting', 'Submerged civilization'),
('orbital space station', 'environment', 'setting', 'Artificial habitat in space'),
('volcanic landscape', 'environment', 'setting', 'Molten and rocky terrain'),
('crystalline cavern', 'environment', 'setting', 'Underground crystal formations'),
('floating sky islands', 'environment', 'setting', 'Aerial landmasses'),
('toxic swamp', 'environment', 'setting', 'Poisonous wetlands'),
('ancient ruins', 'environment', 'setting', 'Crumbling historical structures');

-- Insert cultural artifacts
INSERT OR IGNORE INTO game_assets (name, type, category, description) VALUES
('ceremonial staff', 'cultural_artifact', 'item', 'Ritual weapon or tool'),
('holographic data slate', 'cultural_artifact', 'item', 'Advanced information device'),
('glowing amulet', 'cultural_artifact', 'item', 'Mystical protective charm'),
('intricate blade', 'cultural_artifact', 'item', 'Ornately crafted weapon'),
('tribal mask', 'cultural_artifact', 'item', 'Traditional ceremonial face covering'),
('bioluminescent orb', 'cultural_artifact', 'item', 'Living light source'),
('ancient relic', 'cultural_artifact', 'item', 'Mysterious historical artifact'),
('futuristic headset', 'cultural_artifact', 'item', 'Advanced communication device'),
('ornate scepter', 'cultural_artifact', 'item', 'Decorative symbol of authority'),
('mechanical prosthetic', 'cultural_artifact', 'item', 'Artificial body enhancement');

-- Insert adventurer races
INSERT OR IGNORE INTO game_assets (name, type, category, description) VALUES
('dragonkin', 'race', 'fantasy', 'Dragon-descended humanoids with scales'),
('dwarf', 'race', 'fantasy', 'Stout mountain folk skilled in crafts'),
('elf', 'race', 'fantasy', 'Graceful long-lived forest dwellers'),
('goblin', 'race', 'fantasy', 'Small mischievous creatures'),
('halfling', 'race', 'fantasy', 'Small peaceful folk who love comfort'),
('human', 'race', 'fantasy', 'Versatile and adaptable race'),
('orc', 'race', 'fantasy', 'Strong warrior race with tusks'),
('tiefling', 'race', 'fantasy', 'Humanoids with infernal heritage'),
('half-elf', 'race', 'fantasy', 'Mixed heritage of human and elf'),
('gnome', 'race', 'fantasy', 'Small folk with natural magic affinity'),
('half-orc', 'race', 'fantasy', 'Mixed heritage of human and orc'),
('aasimar', 'race', 'fantasy', 'Humanoids touched by celestial power'),
('genasi', 'race', 'fantasy', 'Elemental-infused humanoids'),
('tabaxi', 'race', 'fantasy', 'Cat-like humanoids from distant lands'),
('kenku', 'race', 'fantasy', 'Raven-like humanoids who mimic sounds'),
('lizardfolk', 'race', 'fantasy', 'Reptilian humanoids from swamps');

-- Insert experience levels
INSERT OR IGNORE INTO game_assets (name, type, category, description) VALUES
('low', 'experience_level', 'progression', 'Novice adventurer with basic skills'),
('mid', 'experience_level', 'progression', 'Experienced adventurer with proven abilities'),
('high', 'experience_level', 'progression', 'Veteran adventurer with legendary skills');

-- Note: For skin colors, hair colors, eye colors etc., we use the existing attributes table
-- The BaseGenerationService queries the AttributeRepository for these values