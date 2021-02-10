/* eslint-env commonjs */
const path = require('path');
const dirSource = path.resolve(__dirname, './src');
const dirAssets = path.resolve(__dirname, './dist');

module.exports = {
  context: dirSource,
  entry: {
    gtag_event_sender: [
      path.resolve(dirSource, '/gtag_event_sender.js'),
    ],
  },
  output: {
    path: path.resolve(dirAssets),
    filename: '[name].min.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
  ],
  optimization: {
  },
};
