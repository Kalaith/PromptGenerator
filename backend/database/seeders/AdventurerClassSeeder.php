<?php

use AnimePromptGen\Models\AdventurerClass;

return new class {
    public function run(): void
    {
        $classes = [
            [
                'name' => 'warrior',
                'description' => 'A brave fighter skilled in combat',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['leather chestplate', 'padded vest', 'chain shirt', 'studded leather'],
                        'weapons' => ['rusted sword', 'wooden club', 'dented shield', 'chipped axe'],
                        'accessories' => ['leather bracers', 'worn belt', 'simple boots', 'torn cloak']
                    ],
                    'mid' => [
                        'armor' => ['chainmail armor', 'scale mail', 'reinforced leather', 'banded mail'],
                        'weapons' => ['steel longsword', 'battle axe', 'round shield', 'war hammer'],
                        'accessories' => ['metal bracers', 'sturdy belt', 'leather boots', 'travel pack']
                    ],
                    'high' => [
                        'armor' => ['full plate armor', 'mithril mail', 'dragon scale armor', 'enchanted plate'],
                        'weapons' => ['masterwork greatsword', 'flaming blade', 'tower shield', 'legendary weapon'],
                        'accessories' => ['royal crest', 'enchanted gauntlets', 'ceremonial cloak', 'magic amulet']
                    ]
                ]
            ],
            [
                'name' => 'mage',
                'description' => 'A spellcaster wielding arcane magic',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['tattered robe', 'apprentice robes', 'cloth tunic', 'simple dress'],
                        'weapons' => ['basic wand', 'wooden staff', 'crystal focus', 'spell component pouch'],
                        'accessories' => ['leather satchel', 'reading glasses', 'ink-stained fingers', 'worn spellbook']
                    ],
                    'mid' => [
                        'armor' => ['runed robe', 'wizard robes', 'enchanted cloak', 'mage vestments'],
                        'weapons' => ['carved staff', 'crystal wand', 'orb of power', 'enchanted focus'],
                        'accessories' => ['spell component belt', 'magical amulet', 'floating candles', 'levitating tome']
                    ],
                    'high' => [
                        'armor' => ['archmage robes', 'starweave cloak', 'reality-bending vestments', 'cosmic robes'],
                        'weapons' => ['staff of power', 'reality-shaping wand', 'artifact orb', 'legendary focus'],
                        'accessories' => ['floating spellbooks', 'crown of intellect', 'time-warped accessories', 'dimensional storage']
                    ]
                ]
            ],
            [
                'name' => 'rogue',
                'description' => 'A stealthy scout and skilled thief',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['dark tunic', 'leather vest', 'hooded shirt', 'simple pants'],
                        'weapons' => ['rusty dagger', 'worn shortsword', 'sling', 'throwing knives'],
                        'accessories' => ['lockpicks', 'worn boots', 'shadowy cloak', 'thieves tools']
                    ],
                    'mid' => [
                        'armor' => ['reinforced leather', 'studded armor', 'dark cloak', 'silent boots'],
                        'weapons' => ['dual daggers', 'poisoned blade', 'hand crossbow', 'smoke bombs'],
                        'accessories' => ['master lockpicks', 'grappling hook', 'caltrops', 'disguise kit']
                    ],
                    'high' => [
                        'armor' => ['shadow leather', 'cloak of elvenkind', 'boots of silence', 'glamered armor'],
                        'weapons' => ['vorpal dagger', 'shadow blade', 'enchanted crossbow', 'legendary poisons'],
                        'accessories' => ['dimensional lockpicks', 'ring of invisibility', 'shadow step boots', 'master disguises']
                    ]
                ]
            ],
            [
                'name' => 'ranger',
                'description' => 'A wilderness scout and hunter',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['patched cloak', 'leather armor', 'travel clothes', 'worn boots'],
                        'weapons' => ['short bow', 'hunting knife', 'wooden arrows', 'simple trap'],
                        'accessories' => ['travel pack', 'rope', 'survival kit', 'animal companion (small)']
                    ],
                    'mid' => [
                        'armor' => ['camouflage gear', 'studded leather', 'forest cloak', 'tracker boots'],
                        'weapons' => ['longbow', 'silvered arrows', 'twin blades', 'net trap'],
                        'accessories' => ['tracking kit', 'herbalism supplies', 'animal companion (medium)', 'wayfinder compass']
                    ],
                    'high' => [
                        'armor' => ['dragon hide armor', 'cloak of the forest lord', 'boots of striding', 'nature\'s blessing'],
                        'weapons' => ['oathbow', 'quiver of endless arrows', 'beast slayer blade', 'legendary traps'],
                        'accessories' => ['animal companion (large)', 'ring of animal friendship', 'nature\'s voice', 'dimensional quiver']
                    ]
                ]
            ],
            [
                'name' => 'cleric',
                'description' => 'A divine spellcaster and healer',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['gray robes', 'simple vestments', 'cloth armor', 'wooden sandals'],
                        'weapons' => ['wooden holy symbol', 'simple mace', 'prayer beads', 'healing herbs'],
                        'accessories' => ['sacred texts', 'offering bowl', 'candles', 'pilgrim staff']
                    ],
                    'mid' => [
                        'armor' => ['blessed robes', 'chain shirt', 'holy vestments', 'sanctified cloak'],
                        'weapons' => ['silver holy symbol', 'blessed mace', 'divine focus', 'healing potions'],
                        'accessories' => ['divine amulet', 'censer', 'holy water', 'blessed shield']
                    ],
                    'high' => [
                        'armor' => ['vestments of divinity', 'celestial armor', 'halo crown', 'wings of light'],
                        'weapons' => ['artifact holy symbol', 'divine hammer', 'staff of healing', 'miracle focus'],
                        'accessories' => ['direct divine connection', 'angelic companion', 'divine blessing', 'resurrection diamond']
                    ]
                ]
            ],
            [
                'name' => 'barbarian',
                'description' => 'A fierce tribal warrior',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['animal pelts', 'tribal clothes', 'fur wraps', 'bone jewelry'],
                        'weapons' => ['stone axe', 'wooden club', 'primitive spear', 'sling'],
                        'accessories' => ['trophy teeth', 'war paint', 'bone necklace', 'tribal tattoos']
                    ],
                    'mid' => [
                        'armor' => ['bear hide', 'reinforced pelts', 'tribal armor', 'bone plates'],
                        'weapons' => ['iron axe', 'war club', 'throwing spears', 'bone blade'],
                        'accessories' => ['trophy belt', 'war scars', 'spirit totems', 'beast companion']
                    ],
                    'high' => [
                        'armor' => ['dragon hide', 'legendary pelts', 'chieftain regalia', 'primal essence'],
                        'weapons' => ['legendary greataxe', 'artifact club', 'weapon of legend', 'primal weapon'],
                        'accessories' => ['crown of leadership', 'legendary scars', 'spirit bond', 'elemental fury']
                    ]
                ]
            ],
            [
                'name' => 'bard',
                'description' => 'A musical performer and storyteller',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['colorful clothes', 'performer outfit', 'traveling clothes', 'bright scarf'],
                        'weapons' => ['simple lute', 'wooden flute', 'small dagger', 'sling'],
                        'accessories' => ['song collection', 'costume pieces', 'makeup kit', 'coin purse']
                    ],
                    'mid' => [
                        'armor' => ['fine clothes', 'bardic costume', 'enchanted outfit', 'performance gear'],
                        'weapons' => ['masterwork instrument', 'rapier', 'magic focus', 'spell component'],
                        'accessories' => ['reputation', 'contacts', 'fan following', 'performance venues']
                    ],
                    'high' => [
                        'armor' => ['legendary costume', 'outfit of fame', 'reality-shaping attire', 'cosmic performance gear'],
                        'weapons' => ['legendary instrument', 'reality-altering music', 'weapon of legend', 'inspiration itself'],
                        'accessories' => ['worldwide fame', 'legendary performances', 'reality-changing songs', 'immortal legacy']
                    ]
                ]
            ],
            [
                'name' => 'monk',
                'description' => 'A martial artist and spiritual seeker',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['simple robes', 'training clothes', 'meditation wrap', 'bare feet'],
                        'weapons' => ['hand wraps', 'wooden staff', 'prayer beads', 'inner discipline'],
                        'accessories' => ['meditation cushion', 'training equipment', 'simple meals', 'spiritual texts']
                    ],
                    'mid' => [
                        'armor' => ['monk robes', 'disciplined attire', 'martial arts uniform', 'focused clothing'],
                        'weapons' => ['fighting sticks', 'chi focus', 'martial weapons', 'inner power'],
                        'accessories' => ['temple connection', 'martial arts training', 'spiritual discipline', 'ki energy']
                    ],
                    'high' => [
                        'armor' => ['robes of perfection', 'transcendent clothing', 'spiritual vestments', 'enlightened form'],
                        'weapons' => ['transcendent techniques', 'pure ki', 'legendary martial arts', 'spiritual weapon'],
                        'accessories' => ['enlightenment', 'perfect balance', 'spiritual transcendence', 'inner peace']
                    ]
                ]
            ],
            [
                'name' => 'paladin',
                'description' => 'A holy warrior dedicated to justice',
                'equipment_config' => [
                    'low' => [
                        'armor' => ['chain shirt', 'simple armor', 'novice gear', 'training equipment'],
                        'weapons' => ['training sword', 'wooden shield', 'holy symbol', 'oath scroll'],
                        'accessories' => ['code of conduct', 'vows', 'simple faith', 'determination']
                    ],
                    'mid' => [
                        'armor' => ['blessed armor', 'righteous gear', 'holy vestments', 'divine protection'],
                        'weapons' => ['blessed sword', 'holy shield', 'divine focus', 'righteous weapon'],
                        'accessories' => ['divine connection', 'holy mission', 'righteous cause', 'divine blessing']
                    ],
                    'high' => [
                        'armor' => ['celestial armor', 'divine protection', 'legendary gear', 'holy radiance'],
                        'weapons' => ['holy avenger', 'divine weapon', 'legendary sword', 'artifact of good'],
                        'accessories' => ['divine mandate', 'celestial connection', 'legendary righteousness', 'avatar status']
                    ]
                ]
            ]
        ];

        foreach ($classes as $class) {
            AdventurerClass::create($class);
        }
    }
};
