-- Update negative prompts to be species-specific and preserve unique features
-- Ensures that species with distinctive features (wings, tails, horns, etc.) are not negatively prompted against their own features

-- Update negative prompts for species with wings - DO NOT include wings in negative prompt
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body'
WHERE wings IS NOT NULL AND wings != ''
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for species with tails - DO NOT include tails in negative prompt
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body'
WHERE tail IS NOT NULL AND tail != ''
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for species with horns - DO NOT include horns in negative prompt
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body'
WHERE (name LIKE '%dragon%' OR name LIKE '%ryu%' OR name LIKE '%oni%' OR name LIKE '%capri%' OR name LIKE '%shika%' OR name LIKE '%ushimimi%')
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for scaled species - DO NOT include scales in negative prompt
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body'
WHERE (name LIKE '%dragon%' OR name LIKE '%ryu%' OR name LIKE '%leviathan%' OR name LIKE '%wyrm%' OR name LIKE '%chimer%' OR name LIKE '%behemoth%' OR name LIKE '%manticore%')
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for aquatic species - DO NOT include fins, gills, or aquatic features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, land-based features'
WHERE (name LIKE '%sakana%' OR name LIKE '%iruka%' OR name LIKE '%same%' OR name LIKE '%kurage%' OR name LIKE '%umigame%' OR name LIKE '%leviathan%')
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for insect/arthropod species - DO NOT include antennae or compound eyes
UPDATE unified_species
SET negative_prompt = 'extra limbs, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, mammalian features'
WHERE (name LIKE '%insecto%' OR name LIKE '%insectoid%' OR name LIKE '%arthropoid%')
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for slime/amoeboid species - DO NOT include amorphous or gelatinous features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, rigid structures'
WHERE (name LIKE '%slime%' OR name LIKE '%kurage%')
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for lamia/snake species - DO NOT include serpentine features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, mammalian features'
WHERE (name LIKE '%lamia%' OR name LIKE '%hebi%')
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for harpy/bird species - DO NOT include avian features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, mammalian features'
WHERE (name LIKE '%harpy%' OR name LIKE '%tori%')
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for alien species - preserve their unique alien features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human appearance, earth-like features, cartoon style'
WHERE type = 'alien';

-- Update negative prompts for fantasy races - preserve their racial features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, cartoon style, disproportionate body'
WHERE type = 'race' AND category = 'standard';

-- Update negative prompts for basic animal-like species (cats, dogs, etc.) - standard negative prompt
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body'
WHERE name IN ('Nekomimi', 'Inumimi', 'Kitsunemimi', 'Usagimimi', 'Ookami', 'Nezumimi', 'Tanukimimi', 'Kumamimi', 'Caprimimi', 'Ushimimi', 'Shikamimi', 'Umamimi')
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for bat/vampire species - DO NOT include bat features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, mammalian features'
WHERE name LIKE '%koumori%'
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for turtle species - DO NOT include turtle features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, mammalian features'
WHERE name LIKE '%umigame%'
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for golem/construct species - DO NOT include stone/crystal features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, organic features'
WHERE name LIKE '%golem%'
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for chimera species - DO NOT include multiple animal features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, uniform appearance'
WHERE name LIKE '%chimer%'
  AND type = 'standard' AND category = 'standard';

-- Update negative prompts for manticore species - DO NOT include lion/scorpion features
UPDATE unified_species
SET negative_prompt = 'extra limbs, extra heads, distorted anatomy, disjointed body parts, surreal shapes, blurry textures, missing features, duplicated elements, glitch effects, malformed faces, human skin texture, cartoon style, disproportionate body, uniform appearance'
WHERE name LIKE '%manticore%'
  AND type = 'standard' AND category = 'standard';

-- Update the updated_at timestamp for all modified records
UPDATE unified_species
SET updated_at = CURRENT_TIMESTAMP
WHERE updated_at < CURRENT_TIMESTAMP - INTERVAL 1 MINUTE;
