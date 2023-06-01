const path = require('path');

module.exports = {
  entry: {
    board: './src/board.js',
    vip_selector: './src/vip_selector.js',
    home: './src/home.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]_bundle.js'
  },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map',
};
