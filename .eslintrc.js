module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 8,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'filenames'
  ],
  rules: {
    "camelcase": [
      2,
      {
        "properties": "always",
      }
    ],
    "filenames/match-regex": 2,
    "filenames/match-exported": 2,
    "filenames/no-index": 2
  },
};
