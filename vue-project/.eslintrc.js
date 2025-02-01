module.exports = {
  env: {
    // browser: true,
    // es6: true,
    node: true,
    //jquery: true,
  },
  extends: [
    'plugin:vue/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: [
    'vue', 'vuetify', 'jsdoc',
  ],
  rules: {
    'jsdoc/require-jsdoc': 0,
    //'sonarjs/no-duplicate-string': 0,
    //'sonarjs/cognitive-complexity': [1, 15],
    //'sonarjs/no-identical-functions': 1,
    'vue/no-use-computed-property-like-method': 'error',
    'vue/no-undef-properties': ['error', {
      ignores: ['$vuetify'],
    }],
    // 'vue/no-unsupported-features': ['error', {
    //   version: '^2.7.0',
    //   ignores: [],
    // }],
    'vue/static-class-names-order': 'error',
    'vue/no-useless-v-bind': 'error',
    'vue/no-useless-mustaches': 'error',
    'vue/html-comment-indent': 'error',
    'vue/html-comment-content-spacing': 'error',
    'vue/html-comment-content-newline': 'error',
    'vue/block-tag-newline': 'error',
    'vue/comma-spacing': 'error',
    'vue/dot-notation': 'error',
    'vue/no-constant-condition': 'error',
    'vue/no-sparse-arrays': 'error',
    'vue/no-useless-concat': 'error',
    'vue/operator-linebreak': ['error', 'before'],
    'vue/prefer-template': 'error',
    //'no-console': ['error', { allow: ['warn', 'error'] }],
    'vue/attributes-order': ['error', {
      order: [
        'DEFINITION',
        'LIST_RENDERING',
        'CONDITIONALS',
        'RENDER_MODIFIERS',
        'GLOBAL',
        ['UNIQUE', 'SLOT'],
        'TWO_WAY_BINDING',
        'OTHER_DIRECTIVES',
        'OTHER_ATTR',
        'EVENTS',
        'CONTENT',
      ],
      alphabetical: false,
    }],
    'vue/eqeqeq': ['error', 'always'],
    'vue/comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'never',
      exports: 'never',
      functions: 'never',
    }],
    'vue/brace-style': ['error', '1tbs', { allowSingleLine: false }],
    'vue/no-empty-component-block': 'error',
    'vue/valid-model-definition': 'error',
    'vue/no-multiple-objects-in-class': 'error',
    'vue/no-unused-properties': ['error', {
      groups: ['props', 'data', 'computed', 'methods', 'setup'],
      deepData: false,
      ignorePublicMembers: false,
    }],
    'vue/require-name-property': 'error',
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'vue/component-options-name-casing': ['error', 'kebab-case'],
    'vue/array-bracket-spacing': ['error', 'never'],
    'vue/no-unused-refs': 'error',
    'vue/arrow-spacing': 'error',
    'vue/no-empty-pattern': 'error',
    'vue/no-irregular-whitespace': 'error',
    'no-plusplus': 0,
    curly: ['error', 'all'],
    'brace-style': ['error', '1tbs', { allowSingleLine: false }],
    camelcase: 0,
    'vue/comment-directive': 0,
    'vue/html-self-closing': 0,
    'vue/prop-name-casing': 0,
    'spaced-comment': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'prefer-destructuring': ['error', { object: false, array: false }],
    'arrow-body-style': ['error', 'always'],
    'max-len': ['error', { code: 150, comments: 150, ignoreUrls: true }],
    'no-restricted-globals': 0,
    'no-alert': 0,
    'no-var': 0,
  },
  overrides: [
    {
      files: ['*.vue', '*.js'],
      rules: {
        'vue/multi-word-component-names': 'off',
        'no-var': 1,
        'vue/no-undef-properties': ['error', {
          ignores: ['$vuetify'],
        }],
      },

    },
  ],
  globals: {
    httpVueLoader: 'readonly',
    Vue: 'readonly',
    $vuetify: 'readonly',
    debounce: 'readonly',
  },
};
