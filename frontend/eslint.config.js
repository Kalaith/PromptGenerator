import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', '*.config.ts', 'vitest.config.ts', 'vite.config.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript rules (basic, no type-aware rules for now)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'error',

      // Component complexity limits - STRICT
      'complexity': ['error', 10],
      'max-depth': ['error', 3],
      'max-lines': ['error', { max: 200, skipComments: true, skipBlankLines: true }],
      'max-lines-per-function': ['error', { max: 50, skipComments: true, skipBlankLines: true }],
      'max-params': ['error', 5],
      'max-nested-callbacks': ['error', 3],

      // React-specific strict rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // General strict rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-unused-expressions': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      'no-void': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-destructuring': ['error', { object: true, array: false }],
      'object-shorthand': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-useless-rename': 'error',
    },
  },
  // Separate config for config files
  {
    files: ['*.config.{ts,js}', 'vitest.config.ts', 'vite.config.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    rules: {
      // Relax some rules for config files
      '@typescript-eslint/explicit-function-return-type': 'off',
      'max-lines': 'off',
    },
  },
)