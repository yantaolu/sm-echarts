module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    // 基础
    'indent': [
      'error',
      2,
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-console': ['error', { 'allow': ['warn', 'error', 'info'] }],
    'no-alert': 'error',
    // ts
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-var-requires': 0,
    // react
    'react/no-deprecated': 0,
    'react/prop-types': 0,
    'react/no-unused-prop-types': 2,
  },
  globals: {},
};
