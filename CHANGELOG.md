# Change Document: Extending the Generator for Monster Image Prompt Generation

## Overview
The current generator is designed for anime animal girl prompts. To extend this functionality for other types of image generators, such as monsters, we need to modularize the data and logic to allow for shared attributes (e.g., hair color, eye color) while maintaining specific attributes for each type (e.g., claws, scales for monsters).

---

## Proposed Changes

### 1. Data Structure
- Create separate data files for each type of generator (`animalGirlsData.ts`, `monstersData.ts`, etc.).
- Extract shared attributes (e.g., `hairColors`, `eyeColors`, `backgrounds`) into a common file (`sharedAttributes.ts`).

#### Example:
```typescript
// sharedAttributes.ts
export const hairColors = ["black", "brown", "blonde", "red", "silver", "grey", "white", "orange", "blue", "green"];
export const eyeColors = ["brown", "blue", "green", "yellow", "golden", "silver", "glowing"];
export const backgrounds = ["neutral background", "light gradient background", "clean background", "minimal background"];
```

```typescript
// monstersData.ts
export const monstersData = {
  Dragon: {
    features: ["scales", "horns", "wings"],
    personality: ["fierce", "majestic", "powerful"],
    negative_prompt: "extra limbs, distorted anatomy, blurry textures",
  },
  Goblin: {
    features: ["pointy ears", "sharp teeth", "green skin"],
    personality: ["mischievous", "cunning", "aggressive"],
    negative_prompt: "distorted anatomy, blurry textures",
  },
};
```

### 2. Prompt Generator Logic
- Refactor the `generatePrompts` function to accept a `type` parameter (e.g., `animalGirl`, `monster`) and load the corresponding data dynamically.
- Use shared attributes for common features and type-specific attributes for unique features.

#### Example:
```typescript
import { hairColors, eyeColors, backgrounds } from './sharedAttributes';
import { speciesData } from './animalGirlsData';
import { monstersData } from './monstersData';

export const generatePrompts = (count: number, type: string, species: string | null) => {
  const data = type === 'animalGirl' ? speciesData : monstersData;
  const prompts = [];
  for (let i = 0; i < count; i++) {
    const selectedSpecies = species === 'random' ? getRandomSpecies(data) : species;
    const speciesInfo = data[selectedSpecies as keyof typeof data];

    const hairColor = getRandomElement(hairColors);
    const eyeColor = getRandomElement(eyeColors);
    const background = getRandomElement(backgrounds);
    const features = getRandomElements(speciesInfo.features, Math.floor(Math.random() * speciesInfo.features.length) + 1);

    const prompt = {
      id: generateUniqueId(),
      title: `${selectedSpecies} Character`,
      description: `A ${selectedSpecies} with ${features.join(', ')}. It has ${hairColor} hair and ${eyeColor} eyes against a ${background}.`,
      negative_prompt: speciesInfo.negative_prompt,
      tags: [selectedSpecies, ...speciesInfo.personality],
    };
    prompts.push(prompt);
  }
  return prompts;
};
```

### 3. UI Updates
- Add a dropdown in the `GeneratorPanel` component to select the type of generator (e.g., `Animal Girl`, `Monster`).
- Dynamically update the species dropdown based on the selected type.

#### Example:
```tsx
const GeneratorPanel: React.FC<GeneratorPanelProps> = ({ type, setType, species, setSpecies, onGenerate }) => {
  const data = type === 'animalGirl' ? speciesData : monstersData;

  return (
    <div>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="animalGirl">Animal Girl</option>
        <option value="monster">Monster</option>
      </select>
      <select value={species} onChange={(e) => setSpecies(e.target.value)}>
        {Object.keys(data).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <button onClick={onGenerate}>Generate</button>
    </div>
  );
};
```

### 4. Testing
- Write unit tests for the `generatePrompts` function to ensure it handles different types correctly.
- Test the UI to verify dynamic updates based on the selected type.

---

## Implementation Steps

### 1. Refactor Data
- Create `sharedAttributes.ts`, `animalGirlsData.ts`, and `monstersData.ts`.
- Move shared attributes to `sharedAttributes.ts`.

### 2. Update Logic
- Refactor `generatePrompts` to support multiple types.
- Add helper functions like `getRandomSpecies` to handle dynamic data.

### 3. Enhance UI
- Update `GeneratorPanel` to include a type selector.
- Dynamically populate the species dropdown based on the selected type.

### 4. Test
- Write unit tests for the generator logic.
- Test the UI for dynamic updates and prompt generation.

---

## Future Enhancements
- Add more types (e.g., `Fantasy Creatures`, `Sci-Fi Characters`).
- Allow customization of shared attributes (e.g., add new hair colors or eye colors).
- Integrate advanced features like tag-based filtering or AI-generated descriptions.

This guide provides a clear roadmap for extending the generator to support monsters and other types.
