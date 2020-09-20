const path = require('path');
const productionConfig = require('./webpack.production.config');

const developmentConfig = Object.assign(productionConfig, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    // local path to output bundle to
    path: path.resolve(__dirname, 'www'),

    // bundle name (based on name specified in entry section)
    filename: '[name].bundle.js'
  }
});

module.exports = developmentConfig;
