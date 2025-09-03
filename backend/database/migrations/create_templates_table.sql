-- Create description_templates table for managing description templates
-- that can be edited for bulk prompt generation

CREATE TABLE IF NOT EXISTS description_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    generator_type TEXT NOT NULL CHECK (generator_type IN ('adventurer', 'alien', 'anime', 'base')),
    template TEXT NOT NULL,
    description TEXT NULL,
    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_default BOOLEAN NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_generator_type ON description_templates (generator_type);
CREATE INDEX IF NOT EXISTS idx_active ON description_templates (is_active);
CREATE INDEX IF NOT EXISTS idx_default ON description_templates (is_default);
CREATE UNIQUE INDEX IF NOT EXISTS unique_default_per_type ON description_templates (generator_type, is_default) WHERE is_default = 1;

-- Insert default templates for each generator type
INSERT OR IGNORE INTO description_templates (name, generator_type, template, description, is_default) VALUES
('Default Adventurer Template', 'adventurer', 
 'An anime-style portrait of a {experience}-level {race} {class} with {skinColor} skin, {hairColor} {hairStyle} hair, and {eyeColor} eyes with {eyeExpression}. {raceFeatures} {pronoun_subject} wears {equipment} and has {facialFeatures}, {pose} against a {background} in {artisticStyle} style.',
 'Standard adventurer description template with all attributes',
 1),

('Detailed Adventurer Template', 'adventurer',
 'A highly detailed anime-style portrait of a {experience}-level {race} {class} adventurer. {pronoun_subject} has {skinColor} skin that gleams in the light, {hairColor} {hairStyle} hair flowing naturally, and striking {eyeColor} eyes with {eyeExpression}. {raceFeatures} {pronoun_subject} is equipped with {equipment}, displaying {facialFeatures}. The adventurer {pose} against a {background}, rendered in {artisticStyle} style with intricate details.',
 'More detailed adventurer template with enhanced descriptions',
 0),

('Minimalist Adventurer Template', 'adventurer',
 '{race} {class}, {experience} level. {hairColor} hair, {eyeColor} eyes, {skinColor} skin. {equipment}. {artisticStyle} style.',
 'Simple, concise adventurer template',
 0),

('Default Anime Template', 'anime',
 'An anime-style portrait of a {personality} {species} with {hairColor} {hairStyle} hair and {eyeColor} eyes. {features} {ears} {tail} {wings} {pronoun_subject} wears {clothing} and has {facialFeatures}, {pose} against a {background}.',
 'Standard anime character description template',
 1),

('Default Alien Template', 'alien',
 'Portrait of a {gender} {class} alien from a {climate} world, depicted in a {artisticStyle} style. Physical features: {physicalFeatures}. Hair: {hairStyle} {hairColor} hair. Eyes: {eyeColor} eyes with {eyeExpression}. {pronoun_subject} wears {clothing} and {pose} in {environment}.',
 'Standard alien character description template',
 1),

('Base Character Template', 'base',
 'An anime-style character with {hairColor} {hairStyle} hair, {eyeColor} eyes, and {skinColor} skin. {pronoun_subject} has {facialFeatures} and {pose} against a {background} in {artisticStyle} style.',
 'Basic character template for any generator',
 1);