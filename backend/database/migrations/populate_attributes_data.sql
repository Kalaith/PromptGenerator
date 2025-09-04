-- Populate attributes table with actual attribute values
-- This fixes the null values issue in dropdowns

-- Clear existing data
DELETE FROM prompt_gen.attributes;

-- Hair Colors
INSERT INTO prompt_gen.attributes (category, name, weight) VALUES 
('hair_colors', 'black', 10),
('hair_colors', 'brown', 10),
('hair_colors', 'blonde', 8),
('hair_colors', 'red', 6),
('hair_colors', 'silver', 5),
('hair_colors', 'grey', 4),
('hair_colors', 'white', 4),
('hair_colors', 'chestnut', 4),
('hair_colors', 'orange', 3),
('hair_colors', 'blue', 3),
('hair_colors', 'green', 3),
('hair_colors', 'ash-blonde', 3),
('hair_colors', 'copper', 3),
('hair_colors', 'yellow', 2),
('hair_colors', 'emerald', 2),
('hair_colors', 'platinum', 2),
('hair_colors', 'violet', 2),
('hair_colors', 'pink', 2),
('hair_colors', 'midnight blue', 2),
('hair_colors', 'forest green', 2);

-- Eye Colors  
INSERT INTO prompt_gen.attributes (category, name, weight) VALUES 
('eye_colors', 'brown', 10),
('eye_colors', 'blue', 9),
('eye_colors', 'green', 8),
('eye_colors', 'hazel', 6),
('eye_colors', 'golden', 5),
('eye_colors', 'amber', 5),
('eye_colors', 'yellow', 4),
('eye_colors', 'emerald', 4),
('eye_colors', 'silver', 3),
('eye_colors', 'violet', 3),
('eye_colors', 'ice blue', 3),
('eye_colors', 'copper', 3),
('eye_colors', 'sapphire', 3),
('eye_colors', 'glowing', 2),
('eye_colors', 'crimson', 2);

-- Hair Styles
INSERT INTO prompt_gen.attributes (category, name, weight) VALUES 
('hair_styles', 'long', 10),
('hair_styles', 'shoulder-length', 9),
('hair_styles', 'short', 8),
('hair_styles', 'medium-length', 8),
('hair_styles', 'straight', 8),
('hair_styles', 'ponytail', 7),
('hair_styles', 'tied back', 6),
('hair_styles', 'messy', 6),
('hair_styles', 'side-swept', 6),
('hair_styles', 'wavy', 6),
('hair_styles', 'twin-tails', 5),
('hair_styles', 'fluffy', 5),
('hair_styles', 'braided', 5),
('hair_styles', 'curly', 5),
('hair_styles', 'cropped', 4),
('hair_styles', 'shaggy', 4),
('hair_styles', 'wild', 4),
('hair_styles', 'top knot', 3),
('hair_styles', 'elegant updo', 3);

-- Eye Expressions
INSERT INTO prompt_gen.attributes (category, name, weight) VALUES 
('eye_expressions', 'gleam with determination', 5),
('eye_expressions', 'radiate confidence', 5),
('eye_expressions', 'sparkle with mischief', 4),
('eye_expressions', 'burn with inner fire', 4),
('eye_expressions', 'shine with wisdom', 4),
('eye_expressions', 'reflect deep thought', 4),
('eye_expressions', 'show fierce resolve', 4),
('eye_expressions', 'glow with magic', 3),
('eye_expressions', 'twinkle with humor', 3),
('eye_expressions', 'hold ancient secrets', 3);

-- Poses
INSERT INTO prompt_gen.attributes (category, name, weight) VALUES 
('poses', 'stands confidently', 6),
('poses', 'looks over her shoulder', 5),
('poses', 'gazes into the distance', 5),
('poses', 'leans casually', 5),
('poses', 'poses heroically', 4),
('poses', 'strikes a dynamic pose', 4),
('poses', 'stands at attention', 4),
('poses', 'prepares for battle', 3),
('poses', 'meditates peacefully', 3),
('poses', 'adopts a fighting stance', 3);

-- Accessories
INSERT INTO prompt_gen.attributes (category, name, weight) VALUES 
('accessories', 'earrings', 6),
('accessories', 'glasses', 5),
('accessories', 'necklace', 5),
('accessories', 'headphones', 4),
('accessories', 'bracelet', 4),
('accessories', 'hairpin', 4),
('accessories', 'watch', 3),
('accessories', 'beanie', 3),
('accessories', 'cap', 3),
('accessories', 'bandana', 2);

-- Facial Features
INSERT INTO prompt_gen.attributes (category, name, weight) VALUES 
('facial_features', 'blush', 5),
('facial_features', 'calm expression', 5),
('facial_features', 'smiling face', 5),
('facial_features', 'freckles', 4),
('facial_features', 'long eyelashes', 4),
('facial_features', 'peaceful expression', 4),
('facial_features', 'sharp eyes', 4),
('facial_features', 'dimples', 3),
('facial_features', 'beauty mark', 3),
('facial_features', 'piercing', 3),
('facial_features', 'thick eyebrows', 3),
('facial_features', 'serious brow', 3),
('facial_features', 'sly grin', 3),
('facial_features', 'scar', 2),
('facial_features', 'tattoo', 2);

-- Gender
INSERT INTO prompt_gen.attributes (category, name, weight, label) VALUES 
('gender', 'female', 1, 'female'),
('gender', 'male', 1, 'male'),
('gender', 'non-binary', 1, 'non-binary');

-- Artistic Style
INSERT INTO prompt_gen.attributes (category, name, weight, label) VALUES 
('artistic_style', 'anime', 1, 'anime'),
('artistic_style', 'chibi', 1, 'chibi'),
('artistic_style', 'digital_art', 1, 'digital_art'),
('artistic_style', 'fantasy', 1, 'fantasy'),
('artistic_style', 'manga', 1, 'manga'),
('artistic_style', 'realistic', 1, 'realistic'),
('artistic_style', 'semi-realistic', 1, 'semi-realistic'),
('artistic_style', 'watercolor', 1, 'watercolor');

-- Environment
INSERT INTO prompt_gen.attributes (category, name, weight, label) VALUES 
('environment', 'beach', 1, 'beach'),
('environment', 'castle', 1, 'castle'),
('environment', 'city', 1, 'city'),
('environment', 'desert', 1, 'desert'),
('environment', 'dungeon', 1, 'dungeon'),
('environment', 'forest', 1, 'forest'),
('environment', 'library', 1, 'library'),
('environment', 'marketplace', 1, 'marketplace'),
('environment', 'mountain', 1, 'mountain'),
('environment', 'ruins', 1, 'ruins'),
('environment', 'tavern', 1, 'tavern'),
('environment', 'temple', 1, 'temple');