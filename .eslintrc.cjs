module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // This repo uses the React 17+ JSX transform (no need to import React in scope).
    // Many components still import React; ignore that variable if left in place.
    'no-unused-vars': ['warn', { varsIgnorePattern: '^React$', argsIgnorePattern: '^_' }],

    // The codebase is not consistently using PropTypes; enforcing this creates noise.
    'react/prop-types': 'off',

    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    // Node ESM config files (Vite/PostCSS/etc).
    {
      files: [
        'vite.config.js',
        'postcss.config.js',
        'tailwind.config.js',
      ],
      env: { node: true, browser: false },
      parserOptions: { sourceType: 'module' },
    },
    // Node/CommonJS files (Tailwind config, proxies, etc).
    {
      files: [
        '*.cjs',
        '*.config.cjs',
        'src/setupProxy.js',
      ],
      env: { node: true, browser: false },
      parserOptions: { sourceType: 'script' },
      globals: { module: 'readonly', require: 'readonly', __dirname: 'readonly' },
    },
  ],
}
