-- Generic attribute configuration system
-- This table controls which attributes appear for each generator type

CREATE TABLE IF NOT EXISTS prompt_gen.attribute_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    generator_type ENUM('anime', 'alien', 'adventurer') NOT NULL,
    category VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    input_type ENUM('select', 'multi-select', 'text', 'number', 'checkbox') NOT NULL DEFAULT 'select',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_generator_category (generator_type, category),
    INDEX idx_generator_active (generator_type, is_active),
    INDEX idx_sort_order (sort_order)
);

-- Populate with current anime attributes
INSERT INTO prompt_gen.attribute_config (generator_type, category, label, input_type, is_active, sort_order) VALUES 
('anime', 'hair_colors', 'Hair Color', 'select', TRUE, 10),
('anime', 'eye_colors', 'Eye Color', 'select', TRUE, 20),
('anime', 'hair_styles', 'Hair Style', 'select', TRUE, 30),
('anime', 'eye_expressions', 'Eye Expression', 'select', TRUE, 40),
('anime', 'poses', 'Pose', 'select', TRUE, 50),
('anime', 'accessories', 'Accessory', 'select', TRUE, 60),
('anime', 'facial_features', 'Facial Features', 'multi-select', TRUE, 70),
('anime', 'gender', 'Gender', 'select', TRUE, 80),
('anime', 'artistic_style', 'Art Style', 'select', TRUE, 90),
('anime', 'environment', 'Environment', 'select', TRUE, 100);

-- Add alien attributes
INSERT INTO prompt_gen.attribute_config (generator_type, category, label, input_type, is_active, sort_order) VALUES 
('alien', 'species_classes', 'Species Class', 'select', TRUE, 10),
('alien', 'climates', 'Climate', 'select', TRUE, 20),
('alien', 'positive_traits', 'Positive Trait', 'select', TRUE, 30),
('alien', 'negative_traits', 'Negative Trait', 'select', TRUE, 40),
('alien', 'artistic_style', 'Art Style', 'select', TRUE, 50),
('alien', 'environment', 'Environment', 'select', TRUE, 60),
('alien', 'gender', 'Gender', 'select', TRUE, 70);

-- Add adventurer attributes  
INSERT INTO prompt_gen.attribute_config (generator_type, category, label, input_type, is_active, sort_order) VALUES 
('adventurer', 'races', 'Race', 'select', TRUE, 10),
('adventurer', 'classes', 'Class', 'select', TRUE, 20),
('adventurer', 'experience_levels', 'Experience Level', 'select', TRUE, 30),
('adventurer', 'gender', 'Gender', 'select', TRUE, 40),
('adventurer', 'artistic_style', 'Art Style', 'select', TRUE, 50),
('adventurer', 'environment', 'Environment', 'select', TRUE, 60),
('adventurer', 'hair_colors', 'Hair Color', 'select', TRUE, 70),
('adventurer', 'skin_colors', 'Skin Color', 'select', TRUE, 80),
('adventurer', 'eye_colors', 'Eye Color', 'select', TRUE, 90),
('adventurer', 'eye_styles', 'Eye Style', 'select', TRUE, 100);