/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')
/** unocss eslint config  */
require('@unocss/eslint-config/flat')

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2023: true
  },
  extends: [
    '@unocss',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  plugin: ['import'],
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    '@unocss/order': 'warn',
    '@unocss/order-attributify': 'warn',
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always-and-inside-groups',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ]
  }
}
