-- Add alien-specific attribute configurations to the attribute_config table
-- This allows the alien generator to use the dynamic attribute system

INSERT IGNORE INTO prompt_gen.attribute_config (generator_type, category, label, input_type, sort_order) VALUES
('alien', 'species_class', 'Species Class', 'select', 1),
('alien', 'climate', 'Climate', 'select', 2),
('alien', 'positive_trait', 'Positive Trait', 'select', 3),
('alien', 'negative_trait', 'Negative Trait', 'select', 4);

-- Add climate options
INSERT IGNORE INTO prompt_gen.attributes (category, name, value, weight) VALUES
('climate', 'arctic', 'arctic', 1),
('climate', 'temperate', 'temperate', 1),
('climate', 'tropical', 'tropical', 1),
('climate', 'desert', 'desert', 1),
('climate', 'oceanic', 'oceanic', 1),
('climate', 'volcanic', 'volcanic', 1),
('climate', 'frozen', 'frozen', 1),
('climate', 'humid', 'humid', 1),
('climate', 'arid', 'arid', 1),
('climate', 'swamp', 'swamp', 1),
('climate', 'mountainous', 'mountainous', 1),
('climate', 'underground', 'underground', 1);

-- Add positive trait options
INSERT IGNORE INTO prompt_gen.attributes (category, name, value, weight) VALUES
('positive_trait', 'intelligent', 'intelligent', 1),
('positive_trait', 'peaceful', 'peaceful', 1),
('positive_trait', 'curious', 'curious', 1),
('positive_trait', 'adaptive', 'adaptive', 1),
('positive_trait', 'resilient', 'resilient', 1),
('positive_trait', 'empathetic', 'empathetic', 1),
('positive_trait', 'resourceful', 'resourceful', 1),
('positive_trait', 'cooperative', 'cooperative', 1),
('positive_trait', 'creative', 'creative', 1),
('positive_trait', 'wise', 'wise', 1),
('positive_trait', 'brave', 'brave', 1),
('positive_trait', 'honorable', 'honorable', 1);

-- Add negative trait options  
INSERT IGNORE INTO prompt_gen.attributes (category, name, value, weight) VALUES
('negative_trait', 'aggressive', 'aggressive', 1),
('negative_trait', 'territorial', 'territorial', 1),
('negative_trait', 'suspicious', 'suspicious', 1),
('negative_trait', 'prideful', 'prideful', 1),
('negative_trait', 'impulsive', 'impulsive', 1),
('negative_trait', 'stubborn', 'stubborn', 1),
('negative_trait', 'secretive', 'secretive', 1),
('negative_trait', 'competitive', 'competitive', 1),
('negative_trait', 'xenophobic', 'xenophobic', 1),
('negative_trait', 'materialistic', 'materialistic', 1),
('negative_trait', 'impatient', 'impatient', 1),
('negative_trait', 'vindictive', 'vindictive', 1);

-- Add species class options (from existing alien species data)
INSERT IGNORE INTO prompt_gen.attributes (category, name, value, weight) VALUES
('species_class', 'humanoid', 'humanoid', 1),
('species_class', 'insectoid', 'insectoid', 1),
('species_class', 'reptilian', 'reptilian', 1),
('species_class', 'aquatic', 'aquatic', 1),
('species_class', 'crystalline', 'crystalline', 1),
('species_class', 'gaseous', 'gaseous', 1),
('species_class', 'mechanical', 'mechanical', 1),
('species_class', 'plant-based', 'plant-based', 1),
('species_class', 'energy-being', 'energy-being', 1),
('species_class', 'symbiotic', 'symbiotic', 1),
('species_class', 'hive-mind', 'hive-mind', 1),
('species_class', 'shapeshifter', 'shapeshifter', 1);