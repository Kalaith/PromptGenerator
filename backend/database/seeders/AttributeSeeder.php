<?php

use AnimePromptGen\Models\Attribute;

return new class {
    public function run(): void
    {
        $attributes = [
            // Hair Colors
            ['category' => 'hair_colors', 'value' => 'black', 'weight' => 10],
            ['category' => 'hair_colors', 'value' => 'brown', 'weight' => 10],
            ['category' => 'hair_colors', 'value' => 'blonde', 'weight' => 8],
            ['category' => 'hair_colors', 'value' => 'red', 'weight' => 6],
            ['category' => 'hair_colors', 'value' => 'silver', 'weight' => 5],
            ['category' => 'hair_colors', 'value' => 'grey', 'weight' => 4],
            ['category' => 'hair_colors', 'value' => 'white', 'weight' => 4],
            ['category' => 'hair_colors', 'value' => 'orange', 'weight' => 3],
            ['category' => 'hair_colors', 'value' => 'blue', 'weight' => 3],
            ['category' => 'hair_colors', 'value' => 'green', 'weight' => 3],
            ['category' => 'hair_colors', 'value' => 'yellow', 'weight' => 2],
            ['category' => 'hair_colors', 'value' => 'emerald', 'weight' => 2],
            ['category' => 'hair_colors', 'value' => 'chestnut', 'weight' => 4],
            ['category' => 'hair_colors', 'value' => 'ash-blonde', 'weight' => 3],
            ['category' => 'hair_colors', 'value' => 'platinum', 'weight' => 2],
            ['category' => 'hair_colors', 'value' => 'copper', 'weight' => 3],
            ['category' => 'hair_colors', 'value' => 'violet', 'weight' => 2],
            ['category' => 'hair_colors', 'value' => 'pink', 'weight' => 2],
            ['category' => 'hair_colors', 'value' => 'midnight blue', 'weight' => 2],
            ['category' => 'hair_colors', 'value' => 'forest green', 'weight' => 2],

            // Hair Styles
            ['category' => 'hair_styles', 'value' => 'short', 'weight' => 8],
            ['category' => 'hair_styles', 'value' => 'long', 'weight' => 10],
            ['category' => 'hair_styles', 'value' => 'shoulder-length', 'weight' => 9],
            ['category' => 'hair_styles', 'value' => 'medium-length', 'weight' => 8],
            ['category' => 'hair_styles', 'value' => 'twin-tails', 'weight' => 5],
            ['category' => 'hair_styles', 'value' => 'ponytail', 'weight' => 7],
            ['category' => 'hair_styles', 'value' => 'tied back', 'weight' => 6],
            ['category' => 'hair_styles', 'value' => 'cropped', 'weight' => 4],
            ['category' => 'hair_styles', 'value' => 'fluffy', 'weight' => 5],
            ['category' => 'hair_styles', 'value' => 'messy', 'weight' => 6],
            ['category' => 'hair_styles', 'value' => 'shaggy', 'weight' => 4],
            ['category' => 'hair_styles', 'value' => 'braided', 'weight' => 5],
            ['category' => 'hair_styles', 'value' => 'top knot', 'weight' => 3],
            ['category' => 'hair_styles', 'value' => 'side-swept', 'weight' => 6],
            ['category' => 'hair_styles', 'value' => 'curly', 'weight' => 5],
            ['category' => 'hair_styles', 'value' => 'wavy', 'weight' => 6],
            ['category' => 'hair_styles', 'value' => 'straight', 'weight' => 8],
            ['category' => 'hair_styles', 'value' => 'wild', 'weight' => 4],
            ['category' => 'hair_styles', 'value' => 'elegant updo', 'weight' => 3],

            // Eye Colors
            ['category' => 'eye_colors', 'value' => 'brown', 'weight' => 10],
            ['category' => 'eye_colors', 'value' => 'blue', 'weight' => 9],
            ['category' => 'eye_colors', 'value' => 'green', 'weight' => 8],
            ['category' => 'eye_colors', 'value' => 'yellow', 'weight' => 4],
            ['category' => 'eye_colors', 'value' => 'golden', 'weight' => 5],
            ['category' => 'eye_colors', 'value' => 'silver', 'weight' => 3],
            ['category' => 'eye_colors', 'value' => 'glowing', 'weight' => 2],
            ['category' => 'eye_colors', 'value' => 'amber', 'weight' => 5],
            ['category' => 'eye_colors', 'value' => 'violet', 'weight' => 3],
            ['category' => 'eye_colors', 'value' => 'crimson', 'weight' => 2],
            ['category' => 'eye_colors', 'value' => 'ice blue', 'weight' => 3],
            ['category' => 'eye_colors', 'value' => 'emerald', 'weight' => 4],
            ['category' => 'eye_colors', 'value' => 'hazel', 'weight' => 6],
            ['category' => 'eye_colors', 'value' => 'copper', 'weight' => 3],
            ['category' => 'eye_colors', 'value' => 'sapphire', 'weight' => 3],

            // Skin Colors
            ['category' => 'skin_colors', 'value' => 'fair', 'weight' => 8],
            ['category' => 'skin_colors', 'value' => 'pale', 'weight' => 6],
            ['category' => 'skin_colors', 'value' => 'light', 'weight' => 8],
            ['category' => 'skin_colors', 'value' => 'medium', 'weight' => 9],
            ['category' => 'skin_colors', 'value' => 'olive', 'weight' => 7],
            ['category' => 'skin_colors', 'value' => 'tan', 'weight' => 7],
            ['category' => 'skin_colors', 'value' => 'dark', 'weight' => 8],
            ['category' => 'skin_colors', 'value' => 'bronze', 'weight' => 5],
            ['category' => 'skin_colors', 'value' => 'golden', 'weight' => 4],
            ['category' => 'skin_colors', 'value' => 'porcelain', 'weight' => 3],
            ['category' => 'skin_colors', 'value' => 'peachy', 'weight' => 4],
            ['category' => 'skin_colors', 'value' => 'rosy', 'weight' => 3],
            ['category' => 'skin_colors', 'value' => 'ebony', 'weight' => 5],
            ['category' => 'skin_colors', 'value' => 'honey', 'weight' => 4],
            ['category' => 'skin_colors', 'value' => 'caramel', 'weight' => 5],

            // Clothing Items
            ['category' => 'clothing_items', 'value' => 'plain shirt', 'weight' => 8],
            ['category' => 'clothing_items', 'value' => 'simple dress', 'weight' => 7],
            ['category' => 'clothing_items', 'value' => 'hoodie', 'weight' => 6],
            ['category' => 'clothing_items', 'value' => 'tank top', 'weight' => 5],
            ['category' => 'clothing_items', 'value' => 'tunic', 'weight' => 4],
            ['category' => 'clothing_items', 'value' => 'utility vest', 'weight' => 3],
            ['category' => 'clothing_items', 'value' => 't-shirt', 'weight' => 7],
            ['category' => 'clothing_items', 'value' => 'short-sleeve shirt', 'weight' => 6],
            ['category' => 'clothing_items', 'value' => 'sleeveless top', 'weight' => 5],

            // Accessories
            ['category' => 'accessories', 'value' => 'glasses', 'weight' => 5],
            ['category' => 'accessories', 'value' => 'headphones', 'weight' => 4],
            ['category' => 'accessories', 'value' => 'earrings', 'weight' => 6],
            ['category' => 'accessories', 'value' => 'necklace', 'weight' => 5],
            ['category' => 'accessories', 'value' => 'bracelet', 'weight' => 4],
            ['category' => 'accessories', 'value' => 'watch', 'weight' => 3],
            ['category' => 'accessories', 'value' => 'hairpin', 'weight' => 4],
            ['category' => 'accessories', 'value' => 'beanie', 'weight' => 3],
            ['category' => 'accessories', 'value' => 'cap', 'weight' => 3],
            ['category' => 'accessories', 'value' => 'bandana', 'weight' => 2],

            // Facial Features
            ['category' => 'facial_features', 'value' => 'freckles', 'weight' => 4],
            ['category' => 'facial_features', 'value' => 'dimples', 'weight' => 3],
            ['category' => 'facial_features', 'value' => 'scar', 'weight' => 2],
            ['category' => 'facial_features', 'value' => 'beauty mark', 'weight' => 3],
            ['category' => 'facial_features', 'value' => 'piercing', 'weight' => 3],
            ['category' => 'facial_features', 'value' => 'tattoo', 'weight' => 2],
            ['category' => 'facial_features', 'value' => 'blush', 'weight' => 5],
            ['category' => 'facial_features', 'value' => 'thick eyebrows', 'weight' => 3],
            ['category' => 'facial_features', 'value' => 'long eyelashes', 'weight' => 4],
            ['category' => 'facial_features', 'value' => 'calm expression', 'weight' => 5],
            ['category' => 'facial_features', 'value' => 'peaceful expression', 'weight' => 4],
            ['category' => 'facial_features', 'value' => 'serious brow', 'weight' => 3],
            ['category' => 'facial_features', 'value' => 'sharp eyes', 'weight' => 4],
            ['category' => 'facial_features', 'value' => 'sly grin', 'weight' => 3],
            ['category' => 'facial_features', 'value' => 'smiling face', 'weight' => 5],

            // Backgrounds
            ['category' => 'backgrounds', 'value' => 'neutral background', 'weight' => 10],
            ['category' => 'backgrounds', 'value' => 'light gradient background', 'weight' => 8],
            ['category' => 'backgrounds', 'value' => 'clean background', 'weight' => 9],
            ['category' => 'backgrounds', 'value' => 'minimal background', 'weight' => 8],
            ['category' => 'backgrounds', 'value' => 'soft background', 'weight' => 7],
            ['category' => 'backgrounds', 'value' => 'mystical forest background', 'weight' => 4],
            ['category' => 'backgrounds', 'value' => 'ancient temple background', 'weight' => 3],
            ['category' => 'backgrounds', 'value' => 'tavern interior background', 'weight' => 3],
            ['category' => 'backgrounds', 'value' => 'mountain peak background', 'weight' => 3],
            ['category' => 'backgrounds', 'value' => 'desert landscape background', 'weight' => 2],
            ['category' => 'backgrounds', 'value' => 'castle courtyard background', 'weight' => 2],
            ['category' => 'backgrounds', 'value' => 'magical library background', 'weight' => 2],

            // Poses
            ['category' => 'poses', 'value' => 'stands confidently', 'weight' => 6],
            ['category' => 'poses', 'value' => 'poses heroically', 'weight' => 4],
            ['category' => 'poses', 'value' => 'looks over her shoulder', 'weight' => 5],
            ['category' => 'poses', 'value' => 'gazes into the distance', 'weight' => 5],
            ['category' => 'poses', 'value' => 'prepares for battle', 'weight' => 3],
            ['category' => 'poses', 'value' => 'meditates peacefully', 'weight' => 3],
            ['category' => 'poses', 'value' => 'strikes a dynamic pose', 'weight' => 4],
            ['category' => 'poses', 'value' => 'leans casually', 'weight' => 5],
            ['category' => 'poses', 'value' => 'stands at attention', 'weight' => 4],
            ['category' => 'poses', 'value' => 'adopts a fighting stance', 'weight' => 3],

            // Eye Expressions
            ['category' => 'eye_expressions', 'value' => 'gleam with determination', 'weight' => 5],
            ['category' => 'eye_expressions', 'value' => 'sparkle with mischief', 'weight' => 4],
            ['category' => 'eye_expressions', 'value' => 'burn with inner fire', 'weight' => 4],
            ['category' => 'eye_expressions', 'value' => 'shine with wisdom', 'weight' => 4],
            ['category' => 'eye_expressions', 'value' => 'glow with magic', 'weight' => 3],
            ['category' => 'eye_expressions', 'value' => 'reflect deep thought', 'weight' => 4],
            ['category' => 'eye_expressions', 'value' => 'show fierce resolve', 'weight' => 4],
            ['category' => 'eye_expressions', 'value' => 'twinkle with humor', 'weight' => 3],
            ['category' => 'eye_expressions', 'value' => 'radiate confidence', 'weight' => 5],
            ['category' => 'eye_expressions', 'value' => 'hold ancient secrets', 'weight' => 3]
        ];

        foreach ($attributes as $attribute) {
            Attribute::create($attribute);
        }
    }
};
