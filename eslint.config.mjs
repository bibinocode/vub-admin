// vue 模版提供的eslint
import pluginVue from 'eslint-plugin-vue'
import eslint from '@eslint/js'
// 让eslint解析ts语法
import tslint from 'typescript-eslint'
// vue 解析器
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-plugin-prettier'
// unocss 支持
import Unocss from '@unocss/eslint-config/flat'
// import 自动排序
import importOrder from 'eslint-plugin-import'

export default tslint.config({
  ignores: ['node_modules', 'dist*'],
  files: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
  extends: [
    eslint.configs.recommended,
    ...tslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    ...Unocss
  ],
  plugins: [prettier, importOrder],
  languageOptions: {
    parser: vueParser,
    sourceType: 'module',
    ecmaVersion: 2020,
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
})
