-- ====================================================================
-- Database: Anime Prompt Generator - Data Population Script
-- Populates tables with seed data from backend/database/seeders
-- Collation: utf8mb4_unicode_ci
-- ====================================================================

-- Disable foreign key checks for clean import
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ====================================================================
-- ADVENTURER CLASSES DATA
-- ====================================================================

INSERT INTO `adventurer_classes` (`name`, `description`, `equipment_config`, `is_active`, `created_at`, `updated_at`) VALUES
('warrior', 'A brave fighter skilled in combat', 
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('leather chestplate', 'padded vest', 'chain shirt', 'studded leather'),
     'weapons', JSON_ARRAY('rusted sword', 'wooden club', 'dented shield', 'chipped axe'),
     'accessories', JSON_ARRAY('leather bracers', 'worn belt', 'simple boots', 'torn cloak')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('chainmail armor', 'scale mail', 'reinforced leather', 'banded mail'),
     'weapons', JSON_ARRAY('steel longsword', 'battle axe', 'round shield', 'war hammer'),
     'accessories', JSON_ARRAY('metal bracers', 'sturdy belt', 'leather boots', 'travel pack')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('full plate armor', 'mithril mail', 'dragon scale armor', 'enchanted plate'),
     'weapons', JSON_ARRAY('masterwork greatsword', 'flaming blade', 'tower shield', 'legendary weapon'),
     'accessories', JSON_ARRAY('royal crest', 'enchanted gauntlets', 'ceremonial cloak', 'magic amulet')
   )
 ), 1, NOW(), NOW()),

('mage', 'A spellcaster wielding arcane magic',
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('tattered robe', 'apprentice robes', 'cloth tunic', 'simple dress'),
     'weapons', JSON_ARRAY('basic wand', 'wooden staff', 'crystal focus', 'spell component pouch'),
     'accessories', JSON_ARRAY('leather satchel', 'reading glasses', 'ink-stained fingers', 'worn spellbook')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('runed robe', 'wizard robes', 'enchanted cloak', 'mage vestments'),
     'weapons', JSON_ARRAY('carved staff', 'crystal wand', 'orb of power', 'enchanted focus'),
     'accessories', JSON_ARRAY('spell component belt', 'magical amulet', 'floating candles', 'levitating tome')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('archmage robes', 'starweave cloak', 'reality-bending vestments', 'cosmic robes'),
     'weapons', JSON_ARRAY('staff of power', 'reality-shaping wand', 'artifact orb', 'legendary focus'),
     'accessories', JSON_ARRAY('floating spellbooks', 'crown of intellect', 'time-warped accessories', 'dimensional storage')
   )
 ), 1, NOW(), NOW()),

('rogue', 'A stealthy scout and skilled thief',
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('dark tunic', 'leather vest', 'hooded shirt', 'simple pants'),
     'weapons', JSON_ARRAY('rusty dagger', 'worn shortsword', 'sling', 'throwing knives'),
     'accessories', JSON_ARRAY('lockpicks', 'worn boots', 'shadowy cloak', 'thieves tools')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('reinforced leather', 'studded armor', 'dark cloak', 'silent boots'),
     'weapons', JSON_ARRAY('dual daggers', 'poisoned blade', 'hand crossbow', 'smoke bombs'),
     'accessories', JSON_ARRAY('master lockpicks', 'grappling hook', 'caltrops', 'disguise kit')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('shadow leather', 'cloak of elvenkind', 'boots of silence', 'glamered armor'),
     'weapons', JSON_ARRAY('vorpal dagger', 'shadow blade', 'enchanted crossbow', 'legendary poisons'),
     'accessories', JSON_ARRAY('dimensional lockpicks', 'ring of invisibility', 'shadow step boots', 'master disguises')
   )
 ), 1, NOW(), NOW()),

('ranger', 'A wilderness scout and hunter',
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('patched cloak', 'leather armor', 'travel clothes', 'worn boots'),
     'weapons', JSON_ARRAY('short bow', 'hunting knife', 'wooden arrows', 'simple trap'),
     'accessories', JSON_ARRAY('travel pack', 'rope', 'survival kit', 'animal companion (small)')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('camouflage gear', 'studded leather', 'forest cloak', 'tracker boots'),
     'weapons', JSON_ARRAY('longbow', 'silvered arrows', 'twin blades', 'net trap'),
     'accessories', JSON_ARRAY('tracking kit', 'herbalism supplies', 'animal companion (medium)', 'wayfinder compass')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('dragon hide armor', 'cloak of the forest lord', 'boots of striding', 'nature\'s blessing'),
     'weapons', JSON_ARRAY('oathbow', 'quiver of endless arrows', 'beast slayer blade', 'legendary traps'),
     'accessories', JSON_ARRAY('animal companion (large)', 'ring of animal friendship', 'nature\'s voice', 'dimensional quiver')
   )
 ), 1, NOW(), NOW()),

('cleric', 'A divine spellcaster and healer',
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('gray robes', 'simple vestments', 'cloth armor', 'wooden sandals'),
     'weapons', JSON_ARRAY('wooden holy symbol', 'simple mace', 'prayer beads', 'healing herbs'),
     'accessories', JSON_ARRAY('sacred texts', 'offering bowl', 'candles', 'pilgrim staff')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('blessed robes', 'chain shirt', 'holy vestments', 'sanctified cloak'),
     'weapons', JSON_ARRAY('silver holy symbol', 'blessed mace', 'divine focus', 'healing potions'),
     'accessories', JSON_ARRAY('divine amulet', 'censer', 'holy water', 'blessed shield')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('vestments of divinity', 'celestial armor', 'halo crown', 'wings of light'),
     'weapons', JSON_ARRAY('artifact holy symbol', 'divine hammer', 'staff of healing', 'miracle focus'),
     'accessories', JSON_ARRAY('direct divine connection', 'angelic companion', 'divine blessing', 'resurrection diamond')
   )
 ), 1, NOW(), NOW()),

('barbarian', 'A fierce tribal warrior',
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('animal pelts', 'tribal clothes', 'fur wraps', 'bone jewelry'),
     'weapons', JSON_ARRAY('stone axe', 'wooden club', 'primitive spear', 'sling'),
     'accessories', JSON_ARRAY('trophy teeth', 'war paint', 'bone necklace', 'tribal tattoos')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('bear hide', 'reinforced pelts', 'tribal armor', 'bone plates'),
     'weapons', JSON_ARRAY('iron axe', 'war club', 'throwing spears', 'bone blade'),
     'accessories', JSON_ARRAY('trophy belt', 'war scars', 'spirit totems', 'beast companion')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('dragon hide', 'legendary pelts', 'chieftain regalia', 'primal essence'),
     'weapons', JSON_ARRAY('legendary greataxe', 'artifact club', 'weapon of legend', 'primal weapon'),
     'accessories', JSON_ARRAY('crown of leadership', 'legendary scars', 'spirit bond', 'elemental fury')
   )
 ), 1, NOW(), NOW()),

('bard', 'A musical performer and storyteller',
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('colorful clothes', 'performer outfit', 'traveling clothes', 'bright scarf'),
     'weapons', JSON_ARRAY('simple lute', 'wooden flute', 'small dagger', 'sling'),
     'accessories', JSON_ARRAY('song collection', 'costume pieces', 'makeup kit', 'coin purse')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('fine clothes', 'bardic costume', 'enchanted outfit', 'performance gear'),
     'weapons', JSON_ARRAY('masterwork instrument', 'rapier', 'magic focus', 'spell component'),
     'accessories', JSON_ARRAY('reputation', 'contacts', 'fan following', 'performance venues')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('legendary costume', 'outfit of fame', 'reality-shaping attire', 'cosmic performance gear'),
     'weapons', JSON_ARRAY('legendary instrument', 'reality-altering music', 'weapon of legend', 'inspiration itself'),
     'accessories', JSON_ARRAY('worldwide fame', 'legendary performances', 'reality-changing songs', 'immortal legacy')
   )
 ), 1, NOW(), NOW()),

('monk', 'A martial artist and spiritual seeker',
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('simple robes', 'training clothes', 'meditation wrap', 'bare feet'),
     'weapons', JSON_ARRAY('hand wraps', 'wooden staff', 'prayer beads', 'inner discipline'),
     'accessories', JSON_ARRAY('meditation cushion', 'training equipment', 'simple meals', 'spiritual texts')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('monk robes', 'disciplined attire', 'martial arts uniform', 'focused clothing'),
     'weapons', JSON_ARRAY('fighting sticks', 'chi focus', 'martial weapons', 'inner power'),
     'accessories', JSON_ARRAY('temple connection', 'martial arts training', 'spiritual discipline', 'ki energy')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('robes of perfection', 'transcendent clothing', 'spiritual vestments', 'enlightened form'),
     'weapons', JSON_ARRAY('transcendent techniques', 'pure ki', 'legendary martial arts', 'spiritual weapon'),
     'accessories', JSON_ARRAY('enlightenment', 'perfect balance', 'spiritual transcendence', 'inner peace')
   )
 ), 1, NOW(), NOW()),

('paladin', 'A holy warrior dedicated to justice',
 JSON_OBJECT(
   'low', JSON_OBJECT(
     'armor', JSON_ARRAY('chain shirt', 'simple armor', 'novice gear', 'training equipment'),
     'weapons', JSON_ARRAY('training sword', 'wooden shield', 'holy symbol', 'oath scroll'),
     'accessories', JSON_ARRAY('code of conduct', 'vows', 'simple faith', 'determination')
   ),
   'mid', JSON_OBJECT(
     'armor', JSON_ARRAY('blessed armor', 'righteous gear', 'holy vestments', 'divine protection'),
     'weapons', JSON_ARRAY('blessed sword', 'holy shield', 'divine focus', 'righteous weapon'),
     'accessories', JSON_ARRAY('divine connection', 'holy mission', 'righteous cause', 'divine blessing')
   ),
   'high', JSON_OBJECT(
     'armor', JSON_ARRAY('celestial armor', 'divine protection', 'legendary gear', 'holy radiance'),
     'weapons', JSON_ARRAY('holy avenger', 'divine weapon', 'legendary sword', 'artifact of good'),
     'accessories', JSON_ARRAY('divine mandate', 'celestial connection', 'legendary righteousness', 'avatar status')
   )
 ), 1, NOW(), NOW());

-- ====================================================================
-- SPECIES DATA - ANIMAL GIRLS
-- ====================================================================

INSERT INTO `species` (`name`, `type`, `species_name`, `ears`, `tail`, `wings`, `features`, `personality`, `negative_prompt`, `description_template`, `is_active`, `created_at`, `updated_at`) VALUES
('Nekomimi', 'animalGirl', 'cat girl', 'feline ears', 'a sleek feline tail', NULL, 
 JSON_ARRAY('whiskers', 'cat-like eyes'), JSON_ARRAY('curious', 'playful', 'agile'),
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.', 
 1, NOW(), NOW()),

('Inumimi', 'animalGirl', 'dog girl', 'floppy ears', 'a wagging dog tail', NULL,
 JSON_ARRAY('loyal eyes', 'dog-like features'), JSON_ARRAY('loyal', 'dependable', 'brave', 'confident'),
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Kitsunemimi', 'animalGirl', 'fox girl', 'fox ears', 'a bushy fox tail', NULL,
 JSON_ARRAY('intelligent eyes', 'fox-like features'), JSON_ARRAY('intelligent', 'cunning', 'scholarly', 'thoughtful'),
 'multiple tails, kimono, fantasy effects, ornate style, glitch effects, malformed anatomy',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Usagimimi', 'animalGirl', 'rabbit girl', 'long rabbit ears', 'a small fluffy tail', NULL,
 JSON_ARRAY('large eyes', 'rabbit-like features'), JSON_ARRAY('shy', 'alert', 'cautious', 'timid', 'focused'),
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Ookami', 'animalGirl', 'wolf girl', 'wolf ears', 'a bushy wolf tail', NULL,
 JSON_ARRAY('strong jawline', 'wolf-like features'), JSON_ARRAY('strong', 'confident', 'assertive', 'bold', 'determined'),
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Nezumimi', 'animalGirl', 'mouse girl', 'round mouse ears', 'a thin mouse tail', NULL,
 JSON_ARRAY('small frame', 'mouse-like features'), JSON_ARRAY('resourceful', 'sly', 'serious', 'clever'),
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Ryūjin', 'animalGirl', 'dragon girl', 'small horns', 'a slender dragon tail', 'small dragon wings',
 JSON_ARRAY('scales on cheeks', 'dragon features', 'faint scales'), JSON_ARRAY('calm', 'mysterious', 'powerful'),
 'extra limbs, wings, tails, surreal features, blurry textures, ornate armor, fantasy background, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Tanukimimi', 'animalGirl', 'tanuki girl', 'rounded tanuki ears', 'a fluffy tanuki tail', NULL,
 JSON_ARRAY('fluffy features', 'tanuki-like traits'), JSON_ARRAY('playful', 'mischievous', 'cheerful'),
 'extra limbs, exaggerated tail, ornate clothing, fantasy elements, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Torimimi', 'animalGirl', 'bird girl', 'feathered ear tufts', NULL, 'small bird wings',
 JSON_ARRAY('sharp eyes', 'feathery bangs', 'bird-like features'), JSON_ARRAY('sharp', 'alert', 'focused'),
 'wings, flying pose, feathers on arms, fantasy background, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Kumamimi', 'animalGirl', 'bear girl', 'round bear ears', NULL, NULL,
 JSON_ARRAY('strong build', 'bear-like features'), JSON_ARRAY('reliable', 'calm', 'strong', 'steady'),
 'hulking build, bear paws, fur coat, fantasy setting, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Insectomimi', 'animalGirl', 'insect girl', 'slender antennae', NULL, 'transparent insect wings',
 JSON_ARRAY('compound eyes', 'chitinous accents', 'insect-like features'), JSON_ARRAY('quiet', 'analytical', 'precise'),
 'oversized mandibles, full insect body, multiple limbs, glitch effects, malformed anatomy, cartoon features',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Caprimimi', 'animalGirl', 'goat girl', 'curved goat ears', 'a small goat tail', NULL,
 JSON_ARRAY('small horns', 'slit pupils', 'goat-like features'), JSON_ARRAY('stubborn', 'independent', 'clever'),
 'full goat body, hooves, surreal horns, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Ushimimi', 'animalGirl', 'cow girl', 'rounded cow ears', 'a short cow tail', NULL,
 JSON_ARRAY('small horns', 'broad eyes', 'cow-like features'), JSON_ARRAY('gentle', 'patient', 'loyal'),
 'udder, hooves, full cow body, fantasy armor, glitch effects, malformed anatomy',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Shikamimi', 'animalGirl', 'deer girl', 'long deer ears', 'a short deer tail', NULL,
 JSON_ARRAY('small antlers', 'graceful posture', 'deer-like features'), JSON_ARRAY('graceful', 'reserved', 'alert'),
 'deer legs, large antlers, hooves, fantasy ornaments, glitch effects, malformed anatomy',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Hebimimi', 'animalGirl', 'snake girl', 'smooth scale patches where ears would be', 'a long slender snake tail', NULL,
 JSON_ARRAY('slitted pupils', 'forked tongue', 'reptilian features'), JSON_ARRAY('mysterious', 'cool-headed', 'seductive'),
 'full snake tail body, extra limbs, snake mouth, surreal anatomy, glitch effects',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Koumorimimi', 'animalGirl', 'bat girl', 'large pointed bat ears', NULL, 'small bat wings',
 JSON_ARRAY('sharp fangs', 'nocturnal eyes', 'bat-like features'), JSON_ARRAY('noisy', 'energetic', 'curious'),
 'full bat wingspan, rodent muzzle, fantasy costume, glitch effects, malformed anatomy',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Umamimi', 'animalGirl', 'horse girl', 'upright horse ears', 'a long horse tail', NULL,
 JSON_ARRAY('long face shape', 'large expressive eyes', 'horse-like features'), JSON_ARRAY('strong', 'hardworking', 'disciplined'),
 'horse nose, hooves, full equine body, racing gear, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Irukamimi', 'animalGirl', 'dolphin girl', 'smooth fin-like ears', 'a smooth dolphin-like tail fin', NULL,
 JSON_ARRAY('playful eyes', 'sleek skin texture', 'dolphin-like features'), JSON_ARRAY('friendly', 'energetic', 'curious'),
 'dolphin head, full tail body, fish scales, blowhole, flippers, cartoon features, glitch effects, malformed anatomy',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Samemimi', 'animalGirl', 'shark girl', 'small gill-like ridges where ears would be', 'a crescent-shaped shark tail', NULL,
 JSON_ARRAY('sharp teeth', 'strong jawline', 'shark-like features'), JSON_ARRAY('confident', 'predatory', 'focused'),
 'full shark head, dorsal fin on head, heavy gills, webbed fingers, glitch effects, malformed anatomy',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Kuragemimi', 'animalGirl', 'jellyfish girl', 'small transparent fins', 'flowing jelly-like strands resembling a tail', NULL,
 JSON_ARRAY('translucent skin', 'soft glowing patterns', 'jellyfish-like features'), JSON_ARRAY('gentle', 'drifting', 'enigmatic'),
 'tentacle limbs, bloated jelly body, missing face, gelatinous mass, glitch effects, malformed anatomy',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Sakana', 'animalGirl', 'fish girl', 'small fin-like ear flaps', 'a wide flowing fish tail', NULL,
 JSON_ARRAY('gill marks on neck', 'shiny scales on cheeks', 'fish-like features'), JSON_ARRAY('quiet', 'calm', 'watchful'),
 'fish head, full scaly body, fins for hands, surreal mutations, glitch effects, malformed anatomy',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW()),

('Umigamimimi', 'animalGirl', 'sea turtle girl', 'rounded turtle ear flaps', 'a small turtle tail', NULL,
 JSON_ARRAY('serene expression', 'slightly textured skin', 'turtle-like features'), JSON_ARRAY('wise', 'patient', 'steady'),
 'turtle shell on back, flipper arms, oversized head, cartoon limbs, glitch effects, malformed faces',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories}, {background}.',
 1, NOW(), NOW());

-- ====================================================================
-- SPECIES DATA - MONSTER GIRLS
-- ====================================================================

INSERT INTO `species` (`name`, `type`, `species_name`, `ears`, `tail`, `wings`, `features`, `personality`, `negative_prompt`, `description_template`, `is_active`, `created_at`, `updated_at`) VALUES
('Ryuujin', 'monsterGirl', 'dragon girl', 'small horns instead of ears', NULL, NULL,
 JSON_ARRAY('draconic eyes', 'faint scales', 'a slender tail'), JSON_ARRAY('mysterious', 'powerful', 'regal'),
 'multiple tails, full-body wings, oversized horns, ornate fantasy armor, glitch effects, malformed anatomy, blurry textures, distorted anatomy, missing features',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.',
 1, NOW(), NOW()),

('Slime', 'monsterGirl', 'slime girl', 'gelatinous protrusions resembling ears', NULL, NULL,
 JSON_ARRAY('semi-transparent body', 'amorphous shape', 'glowing core inside'), JSON_ARRAY('playful', 'curious', 'adaptable'),
 'excessive dripping, multiple heads, hard surfaces, human skin texture, malformed anatomy, glitch effects, surreal layering',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} gel-like hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.',
 1, NOW(), NOW()),

('Lamia', 'monsterGirl', 'lamia girl', 'small pointed ears', NULL, NULL,
 JSON_ARRAY('long snake tail', 'slitted pupils', 'scale-covered lower body'), JSON_ARRAY('seductive', 'cunning', 'calm'),
 'full-body frame, serpentine coils everywhere, fantasy throne, ornate jewelry, malformed anatomy, glitch effects, surreal shapes',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} {hairStyle} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.',
 1, NOW(), NOW()),

('Harpy', 'monsterGirl', 'harpy girl', 'feathered crests instead of ears', NULL, NULL,
 JSON_ARRAY('avian eyes', 'feathered shoulders', 'small wings behind her'), JSON_ARRAY('spirited', 'loud', 'mischievous'),
 'full wings in frame, bird legs, full-body pose, distorted feathers, malformed arms, glitch effects, extra limbs',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} feather-like hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.',
 1, NOW(), NOW()),

('Oni', 'monsterGirl', 'oni girl', 'pointed ears', NULL, NULL,
 JSON_ARRAY('small sharp horns', 'fang-like teeth', 'slightly red-tinted skin'), JSON_ARRAY('boisterous', 'bold', 'battle-hardened'),
 'oversized horns, giant club weapon, heavy armor, glitch effects, distorted proportions, fantasy setting background',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} hair, and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.',
 1, NOW(), NOW()),

('Insectoid', 'monsterGirl', 'insectoid girl', 'antennae instead of ears', NULL, NULL,
 JSON_ARRAY('chitinous shoulder plating', 'faceted eyes', 'small wings on her back'), JSON_ARRAY('quiet', 'precise', 'detached'),
 'multiple compound limbs, full bug body, glowing egg sacs, surreal insect armor, malformed eyes, glitch effects',
 'An anime-style portrait of a {personality} {species} with {features}. She has {ears}, {hairColor} hair (thin or segmented), and {eyeColor} eyes that {eyeExpression}. She {pose}{accessories} set against {background}.',
 1, NOW(), NOW());

-- ====================================================================
-- SPECIES DATA - MONSTERS
-- ====================================================================

INSERT INTO `species` (`name`, `type`, `species_name`, `ears`, `tail`, `wings`, `features`, `personality`, `negative_prompt`, `description_template`, `is_active`, `created_at`, `updated_at`) VALUES
('Dragon', 'monster', 'massive dragon', 'curved horns extending from its skull', 'a long, muscular tail lined with spines', 'broad leathery wings that stretch wide behind it',
 JSON_ARRAY('obsidian scales that glint in the light', 'burning eyes filled with ancient intelligence', 'razor-sharp claws', 'a thunderous roar'), JSON_ARRAY('dominant', 'ancient', 'wrathful'),
 'multiple heads, humanoid shape, tiny wings, ornate fantasy armor, glitch effects, malformed limbs, cartoon style',
 'A {personality} {species} with {features}. It has {ears}, {tail}, and {wings}, looming over a {background}.',
 1, NOW(), NOW()),

('Behemoth', 'monster', 'colossal behemoth', 'no visible ears, only armored ridges', 'a thick tail like a battering ram', NULL,
 JSON_ARRAY('stone-like hide cracked with glowing magma veins', 'tusks the size of trees', 'clawed limbs made for crushing mountains', 'a massive underbelly that drags across the ground'), JSON_ARRAY('unstoppable', 'brutal', 'ancient'),
 'humanoid traits, wings, glowing weapons, sleek design, glitch effects, fantasy armor',
 'An {personality} {species} with {features}. It has {ears} and {tail}, advancing through a {background} with unstoppable force.',
 1, NOW(), NOW()),

('Wyrm', 'monster', 'serpentine wyrm', 'smooth fin-like frills on either side of its head', 'its entire body forms an endless tail', NULL,
 JSON_ARRAY('shimmering scales', 'a finned body that coils through the air', 'a gaping maw with needle teeth', 'a trail of magical mist in its wake'), JSON_ARRAY('mysterious', 'elusive', 'primordial'),
 'legs, humanoid shape, ornate decorations, glitch effects, cartoon features',
 'A {personality} {species} with {features}. It has {ears} and {tail}, weaving through a {background} like living mist.',
 1, NOW(), NOW()),

('Chimera', 'monster', 'twisted chimera', 'three mismatched animal heads with ragged ears', 'a venomous serpent tail that hisses behind it', 'bat-like wings stitched with veins',
 JSON_ARRAY('a lion\'s body with patches of scales and fur', 'clawed limbs that shift with each movement', 'a grotesque fusion of beasts', 'eyes that burn with chaotic energy'), JSON_ARRAY('chaotic', 'vicious', 'unnatural'),
 'clean symmetry, humanoid traits, decorative armor, glitch effects, cartoon faces',
 'A {personality} {species} with {features}. It has {ears}, {tail}, and {wings}, stalking through a {background} like a nightmare made flesh.',
 1, NOW(), NOW()),

('Leviathan', 'monster', 'ancient leviathan', 'long fins flowing from its skull', 'an enormous sea-serpent tail vanishing into the deep', NULL,
 JSON_ARRAY('a scale-armored body stretching for hundreds of meters', 'bioluminescent markings pulsing with eerie light', 'whisker-like tendrils for sensing vibrations', 'a titanic jaw lined with rows of teeth'), JSON_ARRAY('cosmic', 'inevitable', 'silent'),
 'humanoid features, bright fantasy setting, legs, decorative armor, glitch effects',
 'A {personality} {species} with {features}. It has {ears} and {tail}, gliding silently beneath a {background}.',
 1, NOW(), NOW()),

('Golem', 'monster', 'ancient stone golem', 'none, just a carved stone head', NULL, NULL,
 JSON_ARRAY('runic engravings glowing faintly across its body', 'immense arms like fallen pillars', 'a body made of fused boulders and ancient bricks', 'a hollow chest housing a glowing core'), JSON_ARRAY('stoic', 'eternal', 'unyielding'),
 'organic skin, armor plating, humanoid softness, glitch effects, fantasy clothes',
 'A {personality} {species} with {features}. It has {ears} and looms motionless within a {background}.',
 1, NOW(), NOW()),

('Manticore', 'monster', 'feral manticore', 'pointed feline ears with tufts', 'a long scorpion tail tipped with venomous barbs', 'broad bat wings used for sudden pounces',
 JSON_ARRAY('a lion\'s body with crimson fur', 'sharp fangs protruding from its mouth', 'eyes full of bloodlust', 'powerful paws with dagger-like claws'), JSON_ARRAY('aggressive', 'predatory', 'wild'),
 'humanoid traits, feathered wings, fantasy armor, glitch effects, cartoon expressions',
 'A {personality} {species} with {features}. It has {ears}, {tail}, and {wings}, ready to strike from the shadows of a {background}.',
 1, NOW(), NOW());

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- Data population complete
-- ====================================================================