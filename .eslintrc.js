const path = require('path');
const fs = require('fs');
const isRoot = fs.existsSync(path.join(__dirname, 'pnpm-lock.yaml'));
const workspace = isRoot ? __dirname : path.join(__dirname, '../../');
const project = path.join(workspace, 'tsconfig.test.json');

module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  parserOptions: {
    project,
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  settings: {
    react: {
      pragma: 'React',
      version: '17',
    },
  },
  rules: {
    'no-prototype-builtins': 'off',
    'no-sparse-arrays': 'off',

    'max-len': ['warn', {
      code: 80,
    }],
    'indent': ['error', 2],
    'keyword-spacing': 'error',
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'curly': 'error',
    'eqeqeq': ['error', 'always'],
    'no-extra-label': 'error',
    'no-implicit-coercion': 'error',
    'no-multi-spaces': 'error',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
