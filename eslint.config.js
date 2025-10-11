import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // Rules
  stylistic.configs.customize({
    indent: 2,
    semi: false,
  }),

  // Regular TS code
  {
    files: ['**/*.{ts,mts,cts}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
    ],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },

  // JS
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
  },

  // Exclude
  {
    ignores: [
      'dist',
      'node_modules',
    ],
  },

  // Tests
  {
    files: ['**/*.test.{ts,mts,cts}'],
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-floating-promises': ['error', {
        allowForKnownSafeCalls: [
          { from: 'package', package: 'node:test', name: 'it' },
          { from: 'package', package: 'node:test', name: 'test' },
        ],
      }],
    },
  },

  // Overrides
  {
    rules: {
      '@stylistic/quotes': ['error', 'single', {
        avoidEscape: true,
      }],
    },
  },
])
