-- Expand generator_type ENUM to support new unified generator types
-- This allows the attribute system to be configured by the Generator Type Manager

-- First, let's modify the ENUM to include all new generator types
ALTER TABLE prompt_gen.attribute_config 
MODIFY COLUMN generator_type ENUM(
    'anime', 'alien', 'adventurer',  -- existing types
    'animalGirl', 'monsterGirl', 'monster', 'race'  -- new unified types
) NOT NULL;

-- Add attributes for animalGirl (kemonomimi) generator type
INSERT IGNORE INTO prompt_gen.attribute_config (generator_type, category, label, input_type, is_active, sort_order) VALUES 
('animalGirl', 'hair_colors', 'Hair Color', 'select', TRUE, 10),
('animalGirl', 'eye_colors', 'Eye Color', 'select', TRUE, 20),
('animalGirl', 'hair_styles', 'Hair Style', 'select', TRUE, 30),
('animalGirl', 'ear_types', 'Ear Type', 'select', TRUE, 40),
('animalGirl', 'tail_types', 'Tail Type', 'select', TRUE, 50),
('animalGirl', 'poses', 'Pose', 'select', TRUE, 60),
('animalGirl', 'accessories', 'Accessory', 'select', TRUE, 70),
('animalGirl', 'facial_features', 'Facial Features', 'multi-select', TRUE, 80),
('animalGirl', 'gender', 'Gender', 'select', TRUE, 90),
('animalGirl', 'artistic_style', 'Art Style', 'select', TRUE, 100),
('animalGirl', 'environment', 'Environment', 'select', TRUE, 110);

-- Add attributes for monsterGirl generator type
INSERT IGNORE INTO prompt_gen.attribute_config (generator_type, category, label, input_type, is_active, sort_order) VALUES 
('monsterGirl', 'hair_colors', 'Hair Color', 'select', TRUE, 10),
('monsterGirl', 'eye_colors', 'Eye Color', 'select', TRUE, 20),
('monsterGirl', 'monster_features', 'Monster Features', 'multi-select', TRUE, 30),
('monsterGirl', 'wings', 'Wing Type', 'select', TRUE, 40),
('monsterGirl', 'horns', 'Horn Type', 'select', TRUE, 50),
('monsterGirl', 'tail_types', 'Tail Type', 'select', TRUE, 60),
('monsterGirl', 'poses', 'Pose', 'select', TRUE, 70),
('monsterGirl', 'accessories', 'Accessory', 'select', TRUE, 80),
('monsterGirl', 'gender', 'Gender', 'select', TRUE, 90),
('monsterGirl', 'artistic_style', 'Art Style', 'select', TRUE, 100),
('monsterGirl', 'environment', 'Environment', 'select', TRUE, 110);

-- Add attributes for monster generator type
INSERT IGNORE INTO prompt_gen.attribute_config (generator_type, category, label, input_type, is_active, sort_order) VALUES 
('monster', 'monster_type', 'Monster Type', 'select', TRUE, 10),
('monster', 'size', 'Size', 'select', TRUE, 20),
('monster', 'threat_level', 'Threat Level', 'select', TRUE, 30),
('monster', 'habitat', 'Habitat', 'select', TRUE, 40),
('monster', 'special_abilities', 'Special Abilities', 'multi-select', TRUE, 50),
('monster', 'body_type', 'Body Type', 'select', TRUE, 60),
('monster', 'coloration', 'Coloration', 'select', TRUE, 70),
('monster', 'artistic_style', 'Art Style', 'select', TRUE, 80),
('monster', 'environment', 'Environment', 'select', TRUE, 90);

-- Add attributes for race (updated adventurer) generator type  
INSERT IGNORE INTO prompt_gen.attribute_config (generator_type, category, label, input_type, is_active, sort_order) VALUES 
('race', 'races', 'Race', 'select', TRUE, 10),
('race', 'classes', 'Class', 'select', TRUE, 20),
('race', 'experience_levels', 'Experience Level', 'select', TRUE, 30),
('race', 'gender', 'Gender', 'select', TRUE, 40),
('race', 'artistic_style', 'Art Style', 'select', TRUE, 50),
('race', 'environment', 'Environment', 'select', TRUE, 60),
('race', 'hair_colors', 'Hair Color', 'select', TRUE, 70),
('race', 'skin_colors', 'Skin Color', 'select', TRUE, 80),
('race', 'eye_colors', 'Eye Color', 'select', TRUE, 90),
('race', 'eye_styles', 'Eye Style', 'select', TRUE, 100);