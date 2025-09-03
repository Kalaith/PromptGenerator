-- Create templates table for custom prompt templates
CREATE TABLE IF NOT EXISTS templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('anime', 'alien') NOT NULL DEFAULT 'anime',
    template_data JSON NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by VARCHAR(255),
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_is_public (is_public),
    INDEX idx_is_active (is_active),
    INDEX idx_created_by (created_by)
);

-- Insert some default templates
INSERT INTO templates (name, description, type, template_data, is_public, created_by) VALUES
('Magical Girl', 'Classic magical girl character template with sparkles and transformation themes', 'anime', 
 '{"species": "human", "traits": ["magical powers", "colorful outfit", "sparkles"], "style_modifiers": ["magical girl anime", "bright colors", "transformation sequence"], "negative_prompts": ["dark", "gritty", "realistic"]}', 
 TRUE, 'system'),

('Dark Fantasy', 'Dark fantasy character with gothic elements', 'anime', 
 '{"species": "human", "traits": ["mysterious", "gothic clothing", "dark magic"], "style_modifiers": ["dark fantasy", "gothic", "dramatic lighting"], "negative_prompts": ["bright colors", "cheerful", "childish"]}', 
 TRUE, 'system'),

('Mecha Pilot', 'Futuristic mecha pilot character', 'anime', 
 '{"species": "human", "traits": ["pilot suit", "technology", "confident"], "style_modifiers": ["mecha anime", "futuristic", "cyberpunk"], "negative_prompts": ["fantasy", "medieval", "magic"]}', 
 TRUE, 'system'),

('Space Explorer', 'Alien character for space exploration scenarios', 'alien', 
 '{"species_class": "Humanoid", "traits": ["advanced technology", "space suit", "exploration gear"], "environment": "space station", "style_modifiers": ["sci-fi", "futuristic", "clean technology"], "negative_prompts": ["primitive", "fantasy", "medieval"]}', 
 TRUE, 'system'),

('Aquatic Civilization', 'Water-dwelling alien species template', 'alien', 
 '{"species_class": "Aquatic", "climate": "Ocean", "traits": ["bio-luminescent", "water adaptation", "coral technology"], "style_modifiers": ["underwater", "bioluminescent", "organic technology"], "negative_prompts": ["dry", "desert", "fire"]}', 
 TRUE, 'system');