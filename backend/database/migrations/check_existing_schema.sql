-- Check existing database schema before migration
-- Run this first to see what tables exist

SHOW TABLES;

-- If attributes table exists, show its structure
DESCRIBE attributes;

-- If game_assets table exists, show its structure  
DESCRIBE game_assets;

-- If species table exists, show its structure
DESCRIBE species;

-- If alien_species table exists, show its structure
DESCRIBE alien_species;

-- Count records in existing tables
SELECT 'game_assets' as table_name, COUNT(*) as record_count FROM game_assets
UNION ALL
SELECT 'attributes', COUNT(*) FROM attributes WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'attributes' AND table_schema = DATABASE())
UNION ALL  
SELECT 'species', COUNT(*) FROM species WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'species' AND table_schema = DATABASE())
UNION ALL
SELECT 'alien_species', COUNT(*) FROM alien_species WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alien_species' AND table_schema = DATABASE());