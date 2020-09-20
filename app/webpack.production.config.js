const path = require('path');
const node_dir = path.resolve(__dirname, 'node_modules');

module.exports = {
  mode: 'production',
  entry: {
    drinks: path.resolve(__dirname, './www/scripts/index.jsx')
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  output: {
    path: path.resolve(__dirname),
    filename: 'www/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      }
    ]
  }
};
