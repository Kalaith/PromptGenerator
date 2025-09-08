-- ====================================================================
-- Direct INSERT Script for attributes Table
-- Populates attributes with all data from AttributeSeeder
-- Ready for direct phpMyAdmin import
-- ====================================================================

-- Disable foreign key checks for clean import
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Clear existing data if needed
-- TRUNCATE TABLE attributes;

-- ====================================================================
-- ATTRIBUTES DATA - Direct INSERT statements
-- ====================================================================

INSERT INTO `attributes` (`category`, `value`, `weight`, `is_active`, `created_at`, `updated_at`) VALUES

-- Hair Colors
('hair_colors', 'black', 10, 1, NOW(), NOW()),
('hair_colors', 'brown', 10, 1, NOW(), NOW()),
('hair_colors', 'blonde', 8, 1, NOW(), NOW()),
('hair_colors', 'red', 6, 1, NOW(), NOW()),
('hair_colors', 'silver', 5, 1, NOW(), NOW()),
('hair_colors', 'grey', 4, 1, NOW(), NOW()),
('hair_colors', 'white', 4, 1, NOW(), NOW()),
('hair_colors', 'orange', 3, 1, NOW(), NOW()),
('hair_colors', 'blue', 3, 1, NOW(), NOW()),
('hair_colors', 'green', 3, 1, NOW(), NOW()),
('hair_colors', 'yellow', 2, 1, NOW(), NOW()),
('hair_colors', 'emerald', 2, 1, NOW(), NOW()),
('hair_colors', 'chestnut', 4, 1, NOW(), NOW()),
('hair_colors', 'ash-blonde', 3, 1, NOW(), NOW()),
('hair_colors', 'platinum', 2, 1, NOW(), NOW()),
('hair_colors', 'copper', 3, 1, NOW(), NOW()),
('hair_colors', 'violet', 2, 1, NOW(), NOW()),
('hair_colors', 'pink', 2, 1, NOW(), NOW()),
('hair_colors', 'midnight blue', 2, 1, NOW(), NOW()),
('hair_colors', 'forest green', 2, 1, NOW(), NOW()),

-- Hair Styles
('hair_styles', 'short', 8, 1, NOW(), NOW()),
('hair_styles', 'long', 10, 1, NOW(), NOW()),
('hair_styles', 'shoulder-length', 9, 1, NOW(), NOW()),
('hair_styles', 'medium-length', 8, 1, NOW(), NOW()),
('hair_styles', 'twin-tails', 5, 1, NOW(), NOW()),
('hair_styles', 'ponytail', 7, 1, NOW(), NOW()),
('hair_styles', 'tied back', 6, 1, NOW(), NOW()),
('hair_styles', 'cropped', 4, 1, NOW(), NOW()),
('hair_styles', 'fluffy', 5, 1, NOW(), NOW()),
('hair_styles', 'messy', 6, 1, NOW(), NOW()),
('hair_styles', 'shaggy', 4, 1, NOW(), NOW()),
('hair_styles', 'braided', 5, 1, NOW(), NOW()),
('hair_styles', 'top knot', 3, 1, NOW(), NOW()),
('hair_styles', 'side-swept', 6, 1, NOW(), NOW()),
('hair_styles', 'curly', 5, 1, NOW(), NOW()),
('hair_styles', 'wavy', 6, 1, NOW(), NOW()),
('hair_styles', 'straight', 8, 1, NOW(), NOW()),
('hair_styles', 'wild', 4, 1, NOW(), NOW()),
('hair_styles', 'elegant updo', 3, 1, NOW(), NOW()),

-- Eye Colors
('eye_colors', 'brown', 10, 1, NOW(), NOW()),
('eye_colors', 'blue', 9, 1, NOW(), NOW()),
('eye_colors', 'green', 8, 1, NOW(), NOW()),
('eye_colors', 'yellow', 4, 1, NOW(), NOW()),
('eye_colors', 'golden', 5, 1, NOW(), NOW()),
('eye_colors', 'silver', 3, 1, NOW(), NOW()),
('eye_colors', 'glowing', 2, 1, NOW(), NOW()),
('eye_colors', 'amber', 5, 1, NOW(), NOW()),
('eye_colors', 'violet', 3, 1, NOW(), NOW()),
('eye_colors', 'crimson', 2, 1, NOW(), NOW()),
('eye_colors', 'ice blue', 3, 1, NOW(), NOW()),
('eye_colors', 'emerald', 4, 1, NOW(), NOW()),
('eye_colors', 'hazel', 6, 1, NOW(), NOW()),
('eye_colors', 'copper', 3, 1, NOW(), NOW()),
('eye_colors', 'sapphire', 3, 1, NOW(), NOW()),

-- Skin Colors
('skin_colors', 'fair', 8, 1, NOW(), NOW()),
('skin_colors', 'pale', 6, 1, NOW(), NOW()),
('skin_colors', 'light', 8, 1, NOW(), NOW()),
('skin_colors', 'medium', 9, 1, NOW(), NOW()),
('skin_colors', 'olive', 7, 1, NOW(), NOW()),
('skin_colors', 'tan', 7, 1, NOW(), NOW()),
('skin_colors', 'dark', 8, 1, NOW(), NOW()),
('skin_colors', 'bronze', 5, 1, NOW(), NOW()),
('skin_colors', 'golden', 4, 1, NOW(), NOW()),
('skin_colors', 'porcelain', 3, 1, NOW(), NOW()),
('skin_colors', 'peachy', 4, 1, NOW(), NOW()),
('skin_colors', 'rosy', 3, 1, NOW(), NOW()),
('skin_colors', 'ebony', 5, 1, NOW(), NOW()),
('skin_colors', 'honey', 4, 1, NOW(), NOW()),
('skin_colors', 'caramel', 5, 1, NOW(), NOW()),

-- Clothing Items
('clothing_items', 'plain shirt', 8, 1, NOW(), NOW()),
('clothing_items', 'simple dress', 7, 1, NOW(), NOW()),
('clothing_items', 'hoodie', 6, 1, NOW(), NOW()),
('clothing_items', 'tank top', 5, 1, NOW(), NOW()),
('clothing_items', 'tunic', 4, 1, NOW(), NOW()),
('clothing_items', 'utility vest', 3, 1, NOW(), NOW()),
('clothing_items', 't-shirt', 7, 1, NOW(), NOW()),
('clothing_items', 'short-sleeve shirt', 6, 1, NOW(), NOW()),
('clothing_items', 'sleeveless top', 5, 1, NOW(), NOW()),

-- Accessories
('accessories', 'glasses', 5, 1, NOW(), NOW()),
('accessories', 'headphones', 4, 1, NOW(), NOW()),
('accessories', 'earrings', 6, 1, NOW(), NOW()),
('accessories', 'necklace', 5, 1, NOW(), NOW()),
('accessories', 'bracelet', 4, 1, NOW(), NOW()),
('accessories', 'watch', 3, 1, NOW(), NOW()),
('accessories', 'hairpin', 4, 1, NOW(), NOW()),
('accessories', 'beanie', 3, 1, NOW(), NOW()),
('accessories', 'cap', 3, 1, NOW(), NOW()),
('accessories', 'bandana', 2, 1, NOW(), NOW()),

-- Facial Features
('facial_features', 'freckles', 4, 1, NOW(), NOW()),
('facial_features', 'dimples', 3, 1, NOW(), NOW()),
('facial_features', 'scar', 2, 1, NOW(), NOW()),
('facial_features', 'beauty mark', 3, 1, NOW(), NOW()),
('facial_features', 'piercing', 3, 1, NOW(), NOW()),
('facial_features', 'tattoo', 2, 1, NOW(), NOW()),
('facial_features', 'blush', 5, 1, NOW(), NOW()),
('facial_features', 'thick eyebrows', 3, 1, NOW(), NOW()),
('facial_features', 'long eyelashes', 4, 1, NOW(), NOW()),
('facial_features', 'calm expression', 5, 1, NOW(), NOW()),
('facial_features', 'peaceful expression', 4, 1, NOW(), NOW()),
('facial_features', 'serious brow', 3, 1, NOW(), NOW()),
('facial_features', 'sharp eyes', 4, 1, NOW(), NOW()),
('facial_features', 'sly grin', 3, 1, NOW(), NOW()),
('facial_features', 'smiling face', 5, 1, NOW(), NOW()),

-- Backgrounds
('backgrounds', 'neutral background', 10, 1, NOW(), NOW()),
('backgrounds', 'light gradient background', 8, 1, NOW(), NOW()),
('backgrounds', 'clean background', 9, 1, NOW(), NOW()),
('backgrounds', 'minimal background', 8, 1, NOW(), NOW()),
('backgrounds', 'soft background', 7, 1, NOW(), NOW()),
('backgrounds', 'mystical forest background', 4, 1, NOW(), NOW()),
('backgrounds', 'ancient temple background', 3, 1, NOW(), NOW()),
('backgrounds', 'tavern interior background', 3, 1, NOW(), NOW()),
('backgrounds', 'mountain peak background', 3, 1, NOW(), NOW()),
('backgrounds', 'desert landscape background', 2, 1, NOW(), NOW()),
('backgrounds', 'castle courtyard background', 2, 1, NOW(), NOW()),
('backgrounds', 'magical library background', 2, 1, NOW(), NOW()),

-- Poses
('poses', 'stands confidently', 6, 1, NOW(), NOW()),
('poses', 'poses heroically', 4, 1, NOW(), NOW()),
('poses', 'looks over her shoulder', 5, 1, NOW(), NOW()),
('poses', 'gazes into the distance', 5, 1, NOW(), NOW()),
('poses', 'prepares for battle', 3, 1, NOW(), NOW()),
('poses', 'meditates peacefully', 3, 1, NOW(), NOW()),
('poses', 'strikes a dynamic pose', 4, 1, NOW(), NOW()),
('poses', 'leans casually', 5, 1, NOW(), NOW()),
('poses', 'stands at attention', 4, 1, NOW(), NOW()),
('poses', 'adopts a fighting stance', 3, 1, NOW(), NOW()),

-- Eye Expressions
('eye_expressions', 'gleam with determination', 5, 1, NOW(), NOW()),
('eye_expressions', 'sparkle with mischief', 4, 1, NOW(), NOW()),
('eye_expressions', 'burn with inner fire', 4, 1, NOW(), NOW()),
('eye_expressions', 'shine with wisdom', 4, 1, NOW(), NOW()),
('eye_expressions', 'glow with magic', 3, 1, NOW(), NOW()),
('eye_expressions', 'reflect deep thought', 4, 1, NOW(), NOW()),
('eye_expressions', 'show fierce resolve', 4, 1, NOW(), NOW()),
('eye_expressions', 'twinkle with humor', 3, 1, NOW(), NOW()),
('eye_expressions', 'radiate confidence', 5, 1, NOW(), NOW()),
('eye_expressions', 'hold ancient secrets', 3, 1, NOW(), NOW());

-- ====================================================================
-- Summary Statistics
-- ====================================================================

-- Show population results
SELECT 
    category,
    COUNT(*) as attribute_count
FROM attributes 
GROUP BY category
ORDER BY category;

-- Show total count
SELECT COUNT(*) as total_attributes FROM attributes;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- Population completed
-- ====================================================================

SELECT 'Attributes population completed successfully' as status;
SELECT CONCAT('Total attributes inserted: ', COUNT(*)) as result FROM attributes;