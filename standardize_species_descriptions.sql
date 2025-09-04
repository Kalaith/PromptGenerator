-- Standardize descriptions, features, and key traits for unified_species table
-- This script ensures all records have consistent, meaningful descriptions

-- First, update records with NULL descriptions for standard anime species
UPDATE unified_species
SET description = CONCAT(
    name, ' character with ',
    CASE
        WHEN ears IS NOT NULL AND ears != '' THEN CONCAT(LOWER(ears), ', ')
        ELSE ''
    END,
    CASE
        WHEN tail IS NOT NULL AND tail != '' THEN CONCAT(LOWER(tail), ', ')
        ELSE ''
    END,
    CASE
        WHEN wings IS NOT NULL AND wings != '' THEN CONCAT(LOWER(wings), ', ')
        ELSE ''
    END,
    'distinctive animal features'
)
WHERE description IS NULL
  AND type = 'standard'
  AND category = 'standard'
  AND (ears IS NOT NULL OR tail IS NOT NULL OR wings IS NOT NULL);

-- Update features for standard anime species where features is NULL
UPDATE unified_species
SET features = CONCAT(
    '["',
    CASE
        WHEN name LIKE '%neko%' THEN 'feline grace, cat-like reflexes'
        WHEN name LIKE '%inu%' THEN 'canine loyalty, dog-like endurance'
        WHEN name LIKE '%kitsune%' THEN 'fox cunning, mystical aura'
        WHEN name LIKE '%usa%' THEN 'rabbit agility, keen senses'
        WHEN name LIKE '%ookami%' THEN 'wolf strength, pack mentality'
        WHEN name LIKE '%nezu%' THEN 'mouse cleverness, resourcefulness'
        WHEN name LIKE '%ryu%' THEN 'dragon wisdom, ancient power'
        WHEN name LIKE '%tanuki%' THEN 'raccoon mischief, playful nature'
        WHEN name LIKE '%tori%' THEN 'bird freedom, aerial grace'
        WHEN name LIKE '%kuma%' THEN 'bear strength, gentle power'
        WHEN name LIKE '%insecto%' THEN 'insect precision, analytical mind'
        WHEN name LIKE '%capri%' THEN 'goat independence, mountain climber'
        WHEN name LIKE '%ushi%' THEN 'cow patience, nurturing spirit'
        WHEN name LIKE '%shika%' THEN 'deer elegance, forest guardian'
        WHEN name LIKE '%hebi%' THEN 'snake mystery, hypnotic gaze'
        WHEN name LIKE '%koumori%' THEN 'bat mystery, nocturnal hunter'
        WHEN name LIKE '%uma%' THEN 'horse strength, loyal companion'
        WHEN name LIKE '%iruka%' THEN 'dolphin intelligence, playful spirit'
        WHEN name LIKE '%same%' THEN 'shark determination, ocean predator'
        WHEN name LIKE '%kurage%' THEN 'jellyfish mystery, ethereal presence'
        WHEN name LIKE '%sakana%' THEN 'fish tranquility, water adaptation'
        WHEN name LIKE '%umigame%' THEN 'turtle wisdom, ancient knowledge'
        WHEN name LIKE '%slime%' THEN 'amorphous adaptability, curious nature'
        WHEN name LIKE '%lamia%' THEN 'serpent grace, mystical allure'
        WHEN name LIKE '%harpy%' THEN 'avian freedom, spirited nature'
        WHEN name LIKE '%oni%' THEN 'demon strength, warrior spirit'
        WHEN name LIKE '%insectoid%' THEN 'insect coordination, precise movements'
        WHEN name LIKE '%dragon%' THEN 'ancient power, draconic majesty'
        WHEN name LIKE '%behemoth%' THEN 'titanic strength, earth-shaking presence'
        WHEN name LIKE '%wyrm%' THEN 'cosmic mystery, primordial essence'
        WHEN name LIKE '%chimera%' THEN 'beast fusion, chaotic power'
        WHEN name LIKE '%leviathan%' THEN 'oceanic might, cosmic scale'
        WHEN name LIKE '%golem%' THEN 'stone endurance, eternal vigilance'
        WHEN name LIKE '%manticore%' THEN 'predator instinct, lethal grace'
        ELSE 'distinctive animal characteristics'
    END,
    '"]'
)
WHERE features IS NULL
  AND type = 'standard'
  AND category = 'standard';

-- Update key_traits for standard anime species where key_traits is NULL
UPDATE unified_species
SET key_traits = CONCAT(
    '["',
    CASE
        WHEN name LIKE '%neko%' THEN 'agile, curious, independent'
        WHEN name LIKE '%inu%' THEN 'loyal, brave, dependable'
        WHEN name LIKE '%kitsune%' THEN 'cunning, intelligent, mysterious'
        WHEN name LIKE '%usa%' THEN 'shy, alert, focused'
        WHEN name LIKE '%ookami%' THEN 'strong, confident, assertive'
        WHEN name LIKE '%nezu%' THEN 'clever, resourceful, sly'
        WHEN name LIKE '%ryu%' THEN 'wise, powerful, calm'
        WHEN name LIKE '%tanuki%' THEN 'playful, mischievous, cheerful'
        WHEN name LIKE '%tori%' THEN 'sharp, alert, focused'
        WHEN name LIKE '%kuma%' THEN 'reliable, calm, strong'
        WHEN name LIKE '%insecto%' THEN 'precise, analytical, quiet'
        WHEN name LIKE '%capri%' THEN 'independent, clever, stubborn'
        WHEN name LIKE '%ushi%' THEN 'gentle, patient, loyal'
        WHEN name LIKE '%shika%' THEN 'graceful, reserved, alert'
        WHEN name LIKE '%hebi%' THEN 'mysterious, cool-headed, seductive'
        WHEN name LIKE '%koumori%' THEN 'curious, energetic, noisy'
        WHEN name LIKE '%uma%' THEN 'strong, hardworking, disciplined'
        WHEN name LIKE '%iruka%' THEN 'friendly, energetic, curious'
        WHEN name LIKE '%same%' THEN 'confident, predatory, focused'
        WHEN name LIKE '%kurage%' THEN 'gentle, drifting, enigmatic'
        WHEN name LIKE '%sakana%' THEN 'quiet, calm, watchful'
        WHEN name LIKE '%umigame%' THEN 'wise, patient, steady'
        WHEN name LIKE '%slime%' THEN 'playful, curious, adaptable'
        WHEN name LIKE '%lamia%' THEN 'seductive, cunning, calm'
        WHEN name LIKE '%harpy%' THEN 'spirited, loud, mischievous'
        WHEN name LIKE '%oni%' THEN 'boisterous, bold, battle-hardened'
        WHEN name LIKE '%insectoid%' THEN 'quiet, precise, detached'
        WHEN name LIKE '%dragon%' THEN 'dominant, ancient, wrathful'
        WHEN name LIKE '%behemoth%' THEN 'unstoppable, brutal, ancient'
        WHEN name LIKE '%wyrm%' THEN 'mysterious, elusive, primordial'
        WHEN name LIKE '%chimera%' THEN 'chaotic, vicious, unnatural'
        WHEN name LIKE '%leviathan%' THEN 'cosmic, inevitable, silent'
        WHEN name LIKE '%golem%' THEN 'stoic, eternal, unyielding'
        WHEN name LIKE '%manticore%' THEN 'aggressive, predatory, wild'
        ELSE 'distinctive personality traits'
    END,
    '"]'
)
WHERE key_traits IS NULL
  AND type = 'standard'
  AND category = 'standard';

-- Update descriptions for alien species that have NULL descriptions
UPDATE unified_species
SET description = CONCAT(
    LOWER(name), ' alien species with ',
    CASE
        WHEN features IS NOT NULL AND features != '' THEN
            REPLACE(REPLACE(REPLACE(SUBSTRING(features, 3, LENGTH(features)-4), '"', ''), '[', ''), ']', '')
        ELSE 'distinctive alien characteristics'
    END
)
WHERE description IS NULL
  AND type = 'alien';

-- Update descriptions for fantasy races that have NULL or very brief descriptions
UPDATE unified_species
SET description = CONCAT(
    CASE
        WHEN name = 'human' THEN 'Versatile human character with adaptable nature'
        WHEN name = 'elf' THEN 'Graceful elven character with pointed ears and ethereal beauty'
        WHEN name = 'dwarf' THEN 'Sturdy dwarven character known for craftsmanship and determination'
        WHEN name = 'halfling' THEN 'Adventurous halfling character, small but brave'
        WHEN name = 'dragonkin' THEN 'Majestic dragonkin character with draconic heritage'
        WHEN name = 'tiefling' THEN 'Mysterious tiefling character with demonic ancestry'
        WHEN name = 'orc' THEN 'Powerful orcish character with warrior spirit'
        WHEN name = 'gnome' THEN 'Curious gnomish character with inventive mind'
        ELSE CONCAT(name, ' character with distinctive racial features')
    END
)
WHERE (description IS NULL OR LENGTH(description) < 10)
  AND type = 'race'
  AND category = 'standard';

-- Ensure all records have at least basic features if still NULL
UPDATE unified_species
SET features = '["distinctive physical characteristics", "unique cultural traits"]'
WHERE features IS NULL;

-- Ensure all records have at least basic key_traits if still NULL
UPDATE unified_species
SET key_traits = '["adaptable", "resilient", "distinctive"]'
WHERE key_traits IS NULL;

-- Update visual_descriptors for records that have NULL values but have features
UPDATE unified_species
SET visual_descriptors = CONCAT(
    '["',
    CASE
        WHEN name LIKE '%neko%' THEN 'slender build, cat-like eyes, expressive tail'
        WHEN name LIKE '%inu%' THEN 'athletic build, alert eyes, wagging tail'
        WHEN name LIKE '%kitsune%' THEN 'elegant posture, intelligent eyes, flowing tails'
        WHEN name LIKE '%dragon%' THEN 'imposing presence, scaled skin, powerful wings'
        WHEN name LIKE '%slime%' THEN 'translucent body, amorphous shape, glowing core'
        WHEN name LIKE '%lamia%' THEN 'serpentine lower body, hypnotic eyes, graceful coils'
        WHEN name LIKE '%harpy%' THEN 'feathered wings, sharp eyes, avian features'
        WHEN name LIKE '%oni%' THEN 'muscular build, horned head, fierce expression'
        WHEN name = 'human' THEN 'versatile appearance, varied clothing, adaptable features'
        WHEN name = 'elf' THEN 'slender build, pointed ears, ethereal beauty'
        WHEN name = 'dwarf' THEN 'stocky build, braided beard, sturdy features'
        WHEN name = 'orc' THEN 'muscular frame, tusked mouth, tribal markings'
        ELSE 'distinctive visual characteristics'
    END,
    '"]'
)
WHERE visual_descriptors IS NULL;

-- Final check: Ensure no NULL descriptions remain
UPDATE unified_species
SET description = CONCAT(name, ' character with unique ', LOWER(type), ' features')
WHERE description IS NULL;

-- Update the updated_at timestamp for all modified records
UPDATE unified_species
SET updated_at = CURRENT_TIMESTAMP
WHERE updated_at < CURRENT_TIMESTAMP - INTERVAL 1 MINUTE;
