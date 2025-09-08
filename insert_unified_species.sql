-- ====================================================================
-- Direct INSERT Script for unified_species Table  
-- Populates unified_species with all species data from seeders
-- Ready for direct phpMyAdmin import
-- ====================================================================

-- Disable foreign key checks for clean import
SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ====================================================================
-- ANIMAL GIRL SPECIES - Direct INSERT statements
-- ====================================================================

INSERT INTO `unified_species` (`name`, `type`, `category`, `ears`, `tail`, `wings`, `features`, `personality`, `key_traits`, `visual_descriptors`, `physical_features`, `negative_prompt`, `ai_prompt_elements`, `is_active`, `weight`, `created_at`, `updated_at`) VALUES

('Nekomimi', 'animalGirl', 'standard', 'feline ears', 'a sleek feline tail', NULL, 
 JSON_ARRAY('whiskers', 'cat-like eyes'), JSON_ARRAY('curious', 'playful', 'agile'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('slender build, cat-like eyes, expressive tail'), NULL,
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces', 
 NULL, 1, 1, NOW(), NOW()),

('Inumimi', 'animalGirl', 'standard', 'floppy ears', 'a wagging dog tail', NULL,
 JSON_ARRAY('loyal eyes', 'dog-like features'), JSON_ARRAY('loyal', 'dependable', 'brave', 'confident'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('athletic build, alert eyes, wagging tail'), NULL,
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Kitsunemimi', 'animalGirl', 'standard', 'fox ears', 'a bushy fox tail', NULL,
 JSON_ARRAY('intelligent eyes', 'fox-like features'), JSON_ARRAY('intelligent', 'cunning', 'scholarly', 'thoughtful'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('elegant posture, intelligent eyes, flowing tails'), NULL,
 'multiple tails, kimono, fantasy effects, ornate style, glitch effects, malformed anatomy',
 NULL, 1, 1, NOW(), NOW()),

('Usagimimi', 'animalGirl', 'standard', 'long rabbit ears', 'a small fluffy tail', NULL,
 JSON_ARRAY('large eyes', 'rabbit-like features'), JSON_ARRAY('shy', 'alert', 'cautious', 'timid', 'focused'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Ookami', 'animalGirl', 'standard', 'wolf ears', 'a bushy wolf tail', NULL,
 JSON_ARRAY('strong jawline', 'wolf-like features'), JSON_ARRAY('strong', 'confident', 'assertive', 'bold', 'determined'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Nezumimi', 'animalGirl', 'standard', 'round mouse ears', 'a thin mouse tail', NULL,
 JSON_ARRAY('small frame', 'mouse-like features'), JSON_ARRAY('resourceful', 'sly', 'serious', 'clever'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Ryūjin', 'animalGirl', 'standard', 'small horns', 'a slender dragon tail', 'small dragon wings',
 JSON_ARRAY('scales on cheeks', 'dragon features', 'faint scales'), JSON_ARRAY('calm', 'mysterious', 'powerful'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'extra limbs, wings, tails, surreal features, blurry textures, ornate armor, fantasy background, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Tanukimimi', 'animalGirl', 'standard', 'rounded tanuki ears', 'a fluffy tanuki tail', NULL,
 JSON_ARRAY('fluffy features', 'tanuki-like traits'), JSON_ARRAY('playful', 'mischievous', 'cheerful'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'extra limbs, exaggerated tail, ornate clothing, fantasy elements, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Torimimi', 'animalGirl', 'standard', 'feathered ear tufts', NULL, 'small bird wings',
 JSON_ARRAY('sharp eyes', 'feathery bangs', 'bird-like features'), JSON_ARRAY('sharp', 'alert', 'focused'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'wings, flying pose, feathers on arms, fantasy background, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Kumamimi', 'animalGirl', 'standard', 'round bear ears', NULL, NULL,
 JSON_ARRAY('strong build', 'bear-like features'), JSON_ARRAY('reliable', 'calm', 'strong', 'steady'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'hulking build, bear paws, fur coat, fantasy setting, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Insectomimi', 'animalGirl', 'standard', 'slender antennae', NULL, 'transparent insect wings',
 JSON_ARRAY('compound eyes', 'chitinous accents', 'insect-like features'), JSON_ARRAY('quiet', 'analytical', 'precise'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'oversized mandibles, full insect body, multiple limbs, glitch effects, malformed anatomy, cartoon features',
 NULL, 1, 1, NOW(), NOW()),

('Caprimimi', 'animalGirl', 'standard', 'curved goat ears', 'a small goat tail', NULL,
 JSON_ARRAY('small horns', 'slit pupils', 'goat-like features'), JSON_ARRAY('stubborn', 'independent', 'clever'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'full goat body, hooves, surreal horns, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Ushimimi', 'animalGirl', 'standard', 'rounded cow ears', 'a short cow tail', NULL,
 JSON_ARRAY('small horns', 'broad eyes', 'cow-like features'), JSON_ARRAY('gentle', 'patient', 'loyal'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'udder, hooves, full cow body, fantasy armor, glitch effects, malformed anatomy',
 NULL, 1, 1, NOW(), NOW()),

('Shikamimi', 'animalGirl', 'standard', 'long deer ears', 'a short deer tail', NULL,
 JSON_ARRAY('small antlers', 'graceful posture', 'deer-like features'), JSON_ARRAY('graceful', 'reserved', 'alert'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'deer legs, large antlers, hooves, fantasy ornaments, glitch effects, malformed anatomy',
 NULL, 1, 1, NOW(), NOW()),

('Hebimimi', 'animalGirl', 'standard', 'smooth scale patches where ears would be', 'a long slender snake tail', NULL,
 JSON_ARRAY('slitted pupils', 'forked tongue', 'reptilian features'), JSON_ARRAY('mysterious', 'cool-headed', 'seductive'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'full snake tail body, extra limbs, snake mouth, surreal anatomy, glitch effects',
 NULL, 1, 1, NOW(), NOW()),

('Koumorimimi', 'animalGirl', 'standard', 'large pointed bat ears', NULL, 'small bat wings',
 JSON_ARRAY('sharp fangs', 'nocturnal eyes', 'bat-like features'), JSON_ARRAY('noisy', 'energetic', 'curious'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'full bat wingspan, rodent muzzle, fantasy costume, glitch effects, malformed anatomy',
 NULL, 1, 1, NOW(), NOW()),

('Umamimi', 'animalGirl', 'standard', 'upright horse ears', 'a long horse tail', NULL,
 JSON_ARRAY('long face shape', 'large expressive eyes', 'horse-like features'), JSON_ARRAY('strong', 'hardworking', 'disciplined'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'horse nose, hooves, full equine body, racing gear, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW()),

('Irukamimi', 'animalGirl', 'standard', 'smooth fin-like ears', 'a smooth dolphin-like tail fin', NULL,
 JSON_ARRAY('playful eyes', 'sleek skin texture', 'dolphin-like features'), JSON_ARRAY('friendly', 'energetic', 'curious'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'dolphin head, full tail body, fish scales, blowhole, flippers, cartoon features, glitch effects, malformed anatomy',
 NULL, 1, 1, NOW(), NOW()),

('Samemimi', 'animalGirl', 'standard', 'small gill-like ridges where ears would be', 'a crescent-shaped shark tail', NULL,
 JSON_ARRAY('sharp teeth', 'strong jawline', 'shark-like features'), JSON_ARRAY('confident', 'predatory', 'focused'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'full shark head, dorsal fin on head, heavy gills, webbed fingers, glitch effects, malformed anatomy',
 NULL, 1, 1, NOW(), NOW()),

('Kuragemimi', 'animalGirl', 'standard', 'small transparent fins', 'flowing jelly-like strands resembling a tail', NULL,
 JSON_ARRAY('translucent skin', 'soft glowing patterns', 'jellyfish-like features'), JSON_ARRAY('gentle', 'drifting', 'enigmatic'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'tentacle limbs, bloated jelly body, missing face, gelatinous mass, glitch effects, malformed anatomy',
 NULL, 1, 1, NOW(), NOW()),

('Sakana', 'animalGirl', 'standard', 'small fin-like ear flaps', 'a wide flowing fish tail', NULL,
 JSON_ARRAY('gill marks on neck', 'shiny scales on cheeks', 'fish-like features'), JSON_ARRAY('quiet', 'calm', 'watchful'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'fish head, full scaly body, fins for hands, surreal mutations, glitch effects, malformed anatomy',
 NULL, 1, 1, NOW(), NOW()),

('Umigamimimi', 'animalGirl', 'standard', 'rounded turtle ear flaps', 'a small turtle tail', NULL,
 JSON_ARRAY('serene expression', 'slightly textured skin', 'turtle-like features'), JSON_ARRAY('wise', 'patient', 'steady'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'turtle shell on back, flipper arms, oversized head, cartoon limbs, glitch effects, malformed faces',
 NULL, 1, 1, NOW(), NOW());

-- ====================================================================
-- MONSTER GIRL SPECIES - Direct INSERT statements  
-- ====================================================================

INSERT INTO `unified_species` (`name`, `type`, `category`, `ears`, `tail`, `wings`, `features`, `personality`, `key_traits`, `visual_descriptors`, `physical_features`, `negative_prompt`, `ai_prompt_elements`, `is_active`, `weight`, `created_at`, `updated_at`) VALUES

('Slime', 'monsterGirl', 'standard', 'gelatinous protrusions resembling ears', NULL, NULL,
 JSON_ARRAY('semi-transparent body', 'amorphous shape', 'glowing core inside'), JSON_ARRAY('playful', 'curious', 'adaptable'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('translucent body, amorphous shape, glowing core'), NULL,
 'excessive dripping, multiple heads, hard surfaces, human skin texture, malformed anatomy, glitch effects, surreal layering',
 NULL, 1, 1, NOW(), NOW()),

('Lamia', 'monsterGirl', 'standard', 'small pointed ears', NULL, NULL,
 JSON_ARRAY('long snake tail', 'slitted pupils', 'scale-covered lower body'), JSON_ARRAY('seductive', 'cunning', 'calm'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('serpentine lower body, hypnotic eyes, graceful coils'), NULL,
 'full-body frame, serpentine coils everywhere, fantasy throne, ornate jewelry, malformed anatomy, glitch effects, surreal shapes',
 NULL, 1, 1, NOW(), NOW()),

('Harpy', 'monsterGirl', 'standard', 'feathered crests instead of ears', NULL, NULL,
 JSON_ARRAY('avian eyes', 'feathered shoulders', 'small wings behind her'), JSON_ARRAY('spirited', 'loud', 'mischievous'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('feathered wings, sharp eyes, avian features'), NULL,
 'full wings in frame, bird legs, full-body pose, distorted feathers, malformed arms, glitch effects, extra limbs',
 NULL, 1, 1, NOW(), NOW()),

('Oni', 'monster', 'standard', 'pointed ears', NULL, NULL,
 JSON_ARRAY('small sharp horns', 'fang-like teeth', 'slightly red-tinted skin'), JSON_ARRAY('boisterous', 'bold', 'battle-hardened'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('muscular build, horned head, fierce expression'), NULL,
 'oversized horns, giant club weapon, heavy armor, glitch effects, distorted proportions, fantasy setting background',
 NULL, 1, 1, NOW(), NOW()),

('Insectoid', 'monster', 'standard', 'antennae instead of ears', NULL, NULL,
 JSON_ARRAY('chitinous shoulder plating', 'faceted eyes', 'small wings on her back'), JSON_ARRAY('quiet', 'precise', 'detached'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), JSON_ARRAY('distinctive visual characteristics'), NULL,
 'multiple compound limbs, full bug body, glowing egg sacs, surreal insect armor, malformed eyes, glitch effects',
 NULL, 1, 1, NOW(), NOW());

-- ====================================================================
-- MONSTER SPECIES - Direct INSERT statements
-- ====================================================================

INSERT INTO `unified_species` (`name`, `type`, `category`, `ears`, `tail`, `wings`, `features`, `personality`, `key_traits`, `visual_descriptors`, `physical_features`, `ai_prompt_elements`, `negative_prompt`, `is_active`, `weight`, `created_at`, `updated_at`) VALUES

('Dragon', 'monster', 'standard', 'curved horns extending from its skull', 'a long, muscular tail lined with spines', 'broad leathery wings that stretch wide behind it',
 JSON_ARRAY('obsidian scales that glint in the light', 'burning eyes filled with ancient intelligence', 'razor-sharp claws', 'a thunderous roar'), 
 JSON_ARRAY('dominant', 'ancient', 'wrathful'), JSON_ARRAY('adaptable', 'resilient', 'distinctive'), 
 JSON_ARRAY('imposing presence, scaled skin, powerful wings'), NULL, NULL,
 'multiple heads, humanoid shape, tiny wings, ornate fantasy armor, glitch effects, malformed limbs, cartoon style',
 1, 1, NOW(), NOW()),

('Behemoth', 'monster', 'standard', 'no visible ears, only armored ridges', 'a thick tail like a battering ram', NULL,
 JSON_ARRAY('stone-like hide cracked with glowing magma veins', 'tusks the size of trees', 'clawed limbs made for crushing mountains', 'a massive underbelly that drags across the ground'),
 JSON_ARRAY('unstoppable', 'brutal', 'ancient'), JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('distinctive visual characteristics'), NULL, NULL,
 'humanoid traits, wings, glowing weapons, sleek design, glitch effects, fantasy armor',
 1, 1, NOW(), NOW()),

('Wyrm', 'monster', 'standard', 'smooth fin-like frills on either side of its head', 'its entire body forms an endless tail', NULL,
 JSON_ARRAY('shimmering scales', 'a finned body that coils through the air', 'a gaping maw with needle teeth', 'a trail of magical mist in its wake'),
 JSON_ARRAY('mysterious', 'elusive', 'primordial'), JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('distinctive visual characteristics'), NULL, NULL,
 'legs, humanoid shape, ornate decorations, glitch effects, cartoon features',
 1, 1, NOW(), NOW()),

('Chimera', 'monster', 'standard', 'three mismatched animal heads with ragged ears', 'a venomous serpent tail that hisses behind it', 'bat-like wings stitched with veins',
 JSON_ARRAY('a lion\'s body with patches of scales and fur', 'clawed limbs that shift with each movement', 'a grotesque fusion of beasts', 'eyes that burn with chaotic energy'),
 JSON_ARRAY('chaotic', 'vicious', 'unnatural'), JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('distinctive visual characteristics'), NULL, NULL,
 'clean symmetry, humanoid traits, decorative armor, glitch effects, cartoon faces',
 1, 1, NOW(), NOW()),

('Leviathan', 'monster', 'standard', 'long fins flowing from its skull', 'an enormous sea-serpent tail vanishing into the deep', NULL,
 JSON_ARRAY('a scale-armored body stretching for hundreds of meters', 'bioluminescent markings pulsing with eerie light', 'whisker-like tendrils for sensing vibrations', 'a titanic jaw lined with rows of teeth'),
 JSON_ARRAY('cosmic', 'inevitable', 'silent'), JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('distinctive visual characteristics'), NULL, NULL,
 'humanoid features, bright fantasy setting, legs, decorative armor, glitch effects',
 1, 1, NOW(), NOW()),

('Golem', 'monster', 'standard', 'none, just a carved stone head', NULL, NULL,
 JSON_ARRAY('runic engravings glowing faintly across its body', 'immense arms like fallen pillars', 'a body made of fused boulders and ancient bricks', 'a hollow chest housing a glowing core'),
 JSON_ARRAY('stoic', 'eternal', 'unyielding'), JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('distinctive visual characteristics'), NULL, NULL,
 'organic skin, armor plating, humanoid softness, glitch effects, fantasy clothes',
 1, 1, NOW(), NOW()),

('Manticore', 'monster', 'standard', 'pointed feline ears with tufts', 'a long scorpion tail tipped with venomous barbs', 'broad bat wings used for sudden pounces',
 JSON_ARRAY('a lion\'s body with crimson fur', 'sharp fangs protruding from its mouth', 'eyes full of bloodlust', 'powerful paws with dagger-like claws'),
 JSON_ARRAY('aggressive', 'predatory', 'wild'), JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('distinctive visual characteristics'), NULL, NULL,
 'humanoid traits, feathered wings, fantasy armor, glitch effects, cartoon expressions',
 1, 1, NOW(), NOW());

-- ====================================================================
-- ALIEN SPECIES - Direct INSERT statements
-- ====================================================================

INSERT INTO `unified_species` (`name`, `type`, `category`, `features`, `key_traits`, `visual_descriptors`, `physical_features`, `ai_prompt_elements`, `is_active`, `weight`, `created_at`, `updated_at`) VALUES

('Humanoid', 'alien', 'Humanoid', 
 JSON_ARRAY('elongated limbs and graceful proportions', 'diverse skin tones and markings', 'distinctive alien facial features'),
 JSON_ARRAY('adaptive', 'intelligent', 'charismatic', 'strong leadership qualities', 'cultural diversity with multiple government types', 'excellent diplomatic abilities', 'trade focus'),
 JSON_ARRAY('diverse skin tones from pale to deep metallic', 'futuristic clothing with glowing accents', 'ornate diplomatic robes or sleek suits'),
 JSON_ARRAY('classic human appearance', 'exotic variants with unique features', 'Klingon-inspired', 'Vulcan-like', 'cyclops', 'orcs', 'dwarves', 'elves'),
 'Humanoid alien, bipedal, human-like features, diverse skin tones, varied clothing styles, futuristic aesthetic, diplomatic appearance, glowing accessories, intricate hairstyles',
 1, 1, NOW(), NOW()),

('Mammalian', 'alien', 'Mammalian',
 JSON_ARRAY('thick fur covering muscular frame', 'prominent snouts and alert ears', 'expressive animal-like eyes'),
 JSON_ARRAY('social', 'adaptive', 'strong pack mentality', 'good at cooperation', 'community building', 'varied specializations from peaceful to aggressive'),
 JSON_ARRAY('lush fur in vibrant or muted tones', 'tribal or high-tech armor', 'flowing capes or utility harnesses'),
 JSON_ARRAY('primates', 'felines', 'canines', 'ungulates', 'slender monkey-like', 'massive gorilla', 'buffalo variants', 'horse-like', 'tiger-striped', 'otter-like', 'fox-featured', 'bat-like'),
 'Mammalian alien, fur-covered, animal-like features, clothing/garments, varied body sizes from slender to massive, distinct facial features with snouts and ears, tribal markings, high-tech armor',
 1, 1, NOW(), NOW()),

('Reptilian', 'alien', 'Reptilian',
 JSON_ARRAY('tough scaled hide covering athletic body', 'prominent head crests or frills', 'piercing reptilian eyes'),
 JSON_ARRAY('ancient wisdom', 'honor-based societies', 'tactical prowess', 'military leadership', 'strategic thinking', 'long-lived', 'traditional values'),
 JSON_ARRAY('iridescent scales with metallic sheen', 'ceremonial armor with tribal motifs', 'ancient jewelry with gemstone inlays'),
 JSON_ARRAY('crocodilian', 'dinosaur-like', 'chameleon', 'gecko', 'turtle'),
 'Reptilian alien, scaled skin, dinosaur-like or lizard features, prehistoric appearance, earth-toned colors, tribal or military aesthetic, iridescent scales, ceremonial armor',
 1, 1, NOW(), NOW()),

('Avian', 'alien', 'Avian',
 JSON_ARRAY('vibrant feathered plumage covering body', 'sharp curved beak and alert eyes', 'wing-like arm structures'),
 JSON_ARRAY('aerial perspective', 'keen senses', 'exploration focus', 'flight-related abilities', 'spatial awareness', 'natural scouts and explorers'),
 JSON_ARRAY('vibrant feathers with gradient patterns', 'lightweight aerodynamic garments', 'jewelry with feather motifs'),
 JSON_ARRAY('small songbird-like', 'large predatory bird', 'parrot-colored', 'penguin-like', 'eagle-inspired', 'peacock variants'),
 'Avian alien, bird-like features, feathers, beak, wing structures, colorful plumage, aerial grace, predatory or songbird appearance, vibrant feather patterns, aerodynamic clothing',
 1, 1, NOW(), NOW()),

('Arthropoid', 'alien', 'Arthropoid',
 JSON_ARRAY('chitinous exoskeleton covering segmented body', 'multiple articulated limbs', 'large compound eyes'),
 JSON_ARRAY('hive mentality', 'technological efficiency', 'logical thinking', 'large-scale coordination', 'engineering projects', 'technological advancement'),
 JSON_ARRAY('chitinous armor with intricate engravings', 'bioluminescent markings', 'mechanical augmentations on limbs'),
 JSON_ARRAY('spider-like', 'ant-like', 'mantis', 'butterfly', 'crab-like'),
 'Arthropoid alien, insect-like, exoskeleton, multiple limbs, compound eyes, segmented body, chitinous armor, technological aesthetic, bioluminescent markings, mechanical augmentations',
 1, 1, NOW(), NOW()),

('Molluscoid', 'alien', 'Molluscoid',
 JSON_ARRAY('smooth wet-looking skin with flowing tentacles', 'organic curves and translucent elements', 'large expressive eyes'),
 JSON_ARRAY('philosophical nature', 'empathy', 'artistic inclinations', 'research and cultural development', 'peaceful and contemplative'),
 JSON_ARRAY('iridescent skin with shifting colors', 'flowing robes with organic patterns', 'translucent jewelry'),
 JSON_ARRAY('octopus-like', 'jellyfish-inspired', 'slug-like', 'nautilus'),
 'Molluscoid alien, tentacles, soft smooth skin, wet appearance, flowing organic shapes, translucent elements, philosophical demeanor, iridescent skin, organic-patterned robes',
 1, 1, NOW(), NOW()),

('Fungoid', 'alien', 'Fungoid',
 JSON_ARRAY('mushroom cap-like head structure', 'organic growth patterns across body', 'bioluminescent spore patches'),
 JSON_ARRAY('collective consciousness potential', 'adaptation', 'recycling efficiency', 'unique reproduction through spores', 'natural decomposers', 'ecosystem engineers'),
 JSON_ARRAY('bioluminescent spores glowing softly', 'organic armor with fungal growths', 'earthy textures with coral-like accents'),
 JSON_ARRAY('puffball-like', 'parasitic forms', 'coral-inspired'),
 'Fungoid alien, mushroom-like, spore-based, organic growth patterns, caps and gills, earthy colors, parasitic or symbiotic appearance, bioluminescent spores, fungal armor',
 1, 1, NOW(), NOW()),

('Plantoid', 'alien', 'Plantoid',
 JSON_ARRAY('bark-textured skin with leaf and vine elements', 'photosynthetic patches on exposed skin', 'root-like appendages'),
 JSON_ARRAY('budding: enhanced population growth', 'phototrophic/radiotrophic: sustenance through sunlight/radiation', 'environmental harmony', 'patience', 'long-term thinking'),
 JSON_ARRAY('vibrant petals with glowing veins', 'bark armor with natural engravings', 'vine-like accessories wrapping around limbs'),
 JSON_ARRAY('cactus-like', 'flower-inspired', 'tree-like', 'vine-covered'),
 'Plantoid alien, plant-like features, leaves and flowers, bark-textured skin, photosynthetic, green/brown colors, nature harmony aesthetic, glowing petals, vine accessories',
 1, 1, NOW(), NOW()),

('Lithoid', 'alien', 'Lithoid',
 JSON_ARRAY('crystalline formations protruding from stone body', 'gem-like eyes that glow with inner light', 'rocky textured skin with mineral veins'),
 JSON_ARRAY('lithoid: consume minerals, extremely long-lived', 'scintillating skin: produce rare crystals', 'gaseous byproducts: generate exotic gases', 'durability', 'persistence', 'mineral-focused economy'),
 JSON_ARRAY('polished stone with glowing crystal veins', 'ancient runic carvings', 'gem-encrusted adornments'),
 JSON_ARRAY('massive boulder-like bodies', 'smooth stone', 'jagged crystal formations'),
 'Lithoid alien, rock-like, crystalline features, mineral composition, massive boulder body, gem-like elements, geological aesthetic, glowing crystal veins, runic carvings',
 1, 1, NOW(), NOW()),

('Necroid', 'alien', 'Necroid',
 JSON_ARRAY('gaunt skeletal or mummified appearance', 'cybernetic implants glowing faintly', 'spectral aura surrounding body'),
 JSON_ARRAY('necrophage: consume other species for reproduction', 'death-focused culture', 'unnatural longevity', 'cult-like societies', 'reanimation abilities', 'undead workforce'),
 JSON_ARRAY('tattered gothic robes', 'cybernetic implants glowing faintly', 'spectral aura with dark mist'),
 JSON_ARRAY('skeletal', 'mummified', 'spectral', 'cybernetically enhanced'),
 'Necroid alien, undead appearance, skeletal or mummified, gothic aesthetic, dark colors, death-themed, cybernetic enhancements, cult-like, tattered robes, spectral aura',
 1, 1, NOW(), NOW()),

('Aquatic', 'alien', 'Aquatic',
 JSON_ARRAY('sleek aquatic body with fins and gills', 'bioluminescent patterns on smooth skin', 'large eyes adapted for underwater vision'),
 JSON_ARRAY('aquatic: thrive on ocean worlds', 'marine adaptation', 'fluid movement', 'deep-sea wisdom', 'ocean paradise origins', 'seafaring culture'),
 JSON_ARRAY('iridescent scales with bioluminescent patterns', 'flowing aquatic garments', 'coral-inspired jewelry'),
 JSON_ARRAY('fish-like', 'amphibian', 'deep-sea creature'),
 'Aquatic alien, fish-like features, fins and gills, scaled skin, bioluminescent, oceanic aesthetic, graceful swimming posture, iridescent scales, coral jewelry',
 1, 1, NOW(), NOW()),

('Toxoid', 'alien', 'Toxoid',
 JSON_ARRAY('toxic warning coloration on exposed skin', 'protective adaptations and mutations', 'industrial augmentations integrated into body'),
 JSON_ARRAY('noxious: repellent to other species', 'inorganic breath: generate exotic gases', 'exotic metabolism: enhanced adaptation to hostile environments', 'rapid growth at environmental cost', 'industrial focus'),
 JSON_ARRAY('neon warning colors with toxic glow', 'hazmat-style suits', 'industrial machinery integrated into body'),
 JSON_ARRAY('hazmat-suited', 'mutated', 'chemically-enhanced', 'industrial-adapted'),
 'Toxoid alien, toxic appearance, warning colors, industrial aesthetic, hazmat-like features, pollution-adapted, resilient build, neon glow, industrial machinery',
 1, 1, NOW(), NOW()),

('Machine', 'alien', 'Machine',
 JSON_ARRAY('metallic construction with visible joints', 'glowing circuit patterns on body', 'synthetic facial features with digital displays'),
 JSON_ARRAY('machine intelligence: gestalt consciousness, no biological needs', 'superconductive: enhanced efficiency and processing', 'waterproof: environmental adaptation', 'logical thinking', 'technological mastery', 'collective purpose'),
 JSON_ARRAY('polished chrome with glowing circuits', 'sleek synthetic plating', 'holographic interfaces'),
 JSON_ARRAY('humanoid robots', 'mechanical versions of biological species'),
 'Machine alien, robotic appearance, metallic construction, glowing elements, mechanical joints, synthetic aesthetic, technological design, polished chrome, holographic interfaces',
 1, 1, NOW(), NOW());

-- ====================================================================
-- RACE SPECIES - Direct INSERT statements
-- ====================================================================

INSERT INTO `unified_species` (`name`, `type`, `category`, `ears`, `tail`, `wings`, `features`, `personality`, `key_traits`, `visual_descriptors`, `physical_features`, `ai_prompt_elements`, `is_active`, `weight`, `created_at`, `updated_at`) VALUES

('human', 'race', 'standard', NULL, NULL, NULL,
 JSON_ARRAY('distinctive physical characteristics', 'unique cultural traits'), NULL,
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'), 
 JSON_ARRAY('versatile appearance, varied clothing, adaptable features'), NULL, NULL,
 1, 1, NOW(), NOW()),

('elf', 'race', 'standard', 'long pointed elven ears', NULL, NULL,
 JSON_ARRAY('graceful features', 'ethereal beauty', 'slender build'),
 JSON_ARRAY('wise', 'graceful', 'nature-loving', 'patient'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('slender build, pointed ears, ethereal beauty'), NULL, NULL,
 1, 1, NOW(), NOW()),

('dwarf', 'race', 'standard', 'human-like ears', NULL, NULL,
 JSON_ARRAY('sturdy build', 'beard', 'strong hands'),
 JSON_ARRAY('sturdy', 'determined', 'craftsman', 'loyal'),
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('stocky build, braided beard, sturdy features'), NULL, NULL,
 1, 1, NOW(), NOW()),

('halfling', 'race', 'standard', NULL, NULL, NULL,
 JSON_ARRAY('distinctive physical characteristics', 'unique cultural traits'), NULL,
 JSON_ARRAY('adaptable', 'resilient', 'distinctive'),
 JSON_ARRAY('distinctive visual characteristics'), NULL, NULL,
 1, 1, NOW(), NOW());

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- Show results
-- ====================================================================

SELECT 'unified_species data inserted successfully!' as status;