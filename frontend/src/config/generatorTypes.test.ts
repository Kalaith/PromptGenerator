import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { 
  getGeneratorTypes, 
  getGeneratorTypeBySlug, 
  defaultGeneratorTypes 
} from './generatorTypes';

describe('Generator Types Configuration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getGeneratorTypes', () => {
    it('returns default generator types when localStorage is empty', () => {
      const types = getGeneratorTypes();
      
      expect(types).toEqual(defaultGeneratorTypes);
      expect(types).toHaveLength(defaultGeneratorTypes.length);
    });

    it('returns active generator types only by default', () => {
      const types = getGeneratorTypes();
      
      types.forEach(type => {
        expect(type.isActive).toBe(true);
      });
    });

    it('returns all types when includeInactive is true', () => {
      // Add inactive type to localStorage
      const typesWithInactive = [
        ...defaultGeneratorTypes,
        {
          id: 'inactive-test',
          slug: 'inactive-test',
          name: 'Inactive Test',
          description: 'Test inactive type',
          icon: '🚫',
          apiType: 'test',
          buttonGradient: 'bg-gray-500',
          focusColor: 'gray',
          isActive: false,
          order: 999
        }
      ];
      localStorage.setItem('generatorTypes', JSON.stringify(typesWithInactive));

      const activeOnly = getGeneratorTypes();
      const allTypes = getGeneratorTypes(true);

      expect(activeOnly).toHaveLength(defaultGeneratorTypes.length);
      expect(allTypes).toHaveLength(typesWithInactive.length);
    });

    it('loads custom types from localStorage', () => {
      const customTypes = [
        {
          id: 'custom',
          slug: 'custom',
          name: 'Custom Type',
          description: 'Custom test type',
          icon: '🎯',
          apiType: 'custom',
          buttonGradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
          focusColor: 'purple',
          isActive: true,
          order: 1
        }
      ];
      localStorage.setItem('generatorTypes', JSON.stringify(customTypes));

      const types = getGeneratorTypes();
      expect(types).toEqual(customTypes);
    });

    it('falls back to defaults when localStorage has invalid JSON', () => {
      localStorage.setItem('generatorTypes', 'invalid-json');

      const types = getGeneratorTypes();
      expect(types).toEqual(defaultGeneratorTypes);
    });
  });

  describe('getGeneratorTypeBySlug', () => {
    it('returns correct type for valid slug', () => {
      const type = getGeneratorTypeBySlug('kemonomimi');
      
      expect(type).toBeDefined();
      expect(type?.slug).toBe('kemonomimi');
      expect(type?.name).toBe('Kemonomimi');
    });

    it('returns undefined for invalid slug', () => {
      const type = getGeneratorTypeBySlug('nonexistent');
      expect(type).toBeUndefined();
    });

    it('respects custom types from localStorage', () => {
      const customTypes = [
        {
          id: 'custom',
          slug: 'custom',
          name: 'Custom Type',
          description: 'Custom test type',
          icon: '🎯',
          apiType: 'custom',
          buttonGradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
          focusColor: 'purple',
          isActive: true,
          order: 1
        }
      ];
      localStorage.setItem('generatorTypes', JSON.stringify(customTypes));

      const type = getGeneratorTypeBySlug('custom');
      expect(type).toBeDefined();
      expect(type?.name).toBe('Custom Type');
    });
  });

  describe('defaultGeneratorTypes', () => {
    it('has expected structure', () => {
      defaultGeneratorTypes.forEach(type => {
        expect(type).toHaveProperty('id');
        expect(type).toHaveProperty('slug');
        expect(type).toHaveProperty('name');
        expect(type).toHaveProperty('description');
        expect(type).toHaveProperty('icon');
        expect(type).toHaveProperty('apiType');
        expect(type).toHaveProperty('buttonGradient');
        expect(type).toHaveProperty('focusColor');
        expect(type).toHaveProperty('isActive');
        expect(type).toHaveProperty('order');
      });
    });

    it('all default types are active', () => {
      defaultGeneratorTypes.forEach(type => {
        expect(type.isActive).toBe(true);
      });
    });

    it('has unique slugs', () => {
      const slugs = defaultGeneratorTypes.map(type => type.slug);
      const uniqueSlugs = [...new Set(slugs)];
      expect(slugs).toHaveLength(uniqueSlugs.length);
    });
  });
});