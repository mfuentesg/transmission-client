module.exports = {
  settings: {
    react: {
      version: 'detect',
      pragma: 'React',
      createClass: 'createReactClass'
    }
  },
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    jest: true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'prettier/prettier': ['error', { singleQuote: true }],
    'import/no-cycle': 0,
    'import/no-named-as-default': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.tsx']
      }
    ],
    'no-console': 2,
    'import/prefer-default-export': 0,
    'no-unused-vars': [
      1,
      {
        argsIgnorePattern: '^_'
      }
    ]
  }
};
