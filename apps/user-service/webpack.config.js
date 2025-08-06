const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const path = require('path');
const { join } = path;

module.exports = {
    resolve: {
    alias: {
      '@hashtag-common-utils': path.resolve(__dirname, '../../libs/hashtag-common-utils/dist'),
      '@hashtag-common-types': path.resolve(__dirname, '../../libs/hashtag-common-types/dist'),
      '@hashtag-common-ui': path.resolve(__dirname, '../../libs/hashtag-common-ui/dist'),
    },
    extensions: ['.ts', '.js', '.json'],
  },
  output: {
    path: join(__dirname, 'dist'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
  ],
};
