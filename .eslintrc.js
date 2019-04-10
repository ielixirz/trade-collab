module.exports = {
  env: {
    browser: true,
  },
  parser: 'babel-eslint',
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
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  },
};
