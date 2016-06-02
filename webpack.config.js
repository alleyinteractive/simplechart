var path = require('path');
var webpack = require('webpack');
var postcss = require('postcss');
var postcssImport = require('postcss-import');
var postcssNested = require('postcss-nested');
var postcssCustomProps = require('postcss-custom-properties');
var autoprefixer = require('autoprefixer');
var postcssCalc = require('postcss-calc');
var postcssLost = require('lost');
var stylelint = require('stylelint');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var entry = [];
var output = {
  path: path.join(__dirname, 'static'),
  publicPath: '/static/'
};

if (process.env.WIDGET) {
  entry.push('./app/widget');
  output.filename = 'widget.js';
} else {
  entry.push('./app/index');
  output.filename = 'bundle.js';
}

var jsLoaders = ['babel'];

if (process.env.DEVELOPMENT) {
  entry.unshift(
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server'
  );
  jsLoaders.unshift(
    'react-hot'
  );
}

var plugins = process.env.DEVELOPMENT ?
  [new webpack.HotModuleReplacementPlugin()] :
  [];

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: output,
  plugins: plugins,
  postcss: function(webpack) {
    return [
      postcssImport({
        addDependencyTo: webpack,
      }),
      postcssNested,
      postcssCustomProps,
      autoprefixer,
      postcssCalc,
      postcssLost,
      stylelint(require('./stylelint.config.js')),
    ];
  },
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint', exclude: /node_modules/ },
    ],
    loaders: [
      {
        test: /\.js$/,
        loaders: jsLoaders,
        include: path.join(__dirname, 'app'),
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: 'style!css?modules&localIdentName=[name]__[local]___[hash:base64:5]!postcss',
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=25000',
      }
   ]
  }
};
