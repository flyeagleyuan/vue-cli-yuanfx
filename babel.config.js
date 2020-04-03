module.exports = {
  plugins: [
    'lodash',
    [
      'component',
      {
        libraryName: 'mint-ui',
        style: true,
      },
    ],
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
  ],
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          browsers: ['last 10 versions', 'ios 6'],
        },
        useBuiltIns: 'usage',
        debug: false,
        corejs: 3,
      },
    ],
  ],
};
