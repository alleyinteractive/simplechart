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
var WebpackGitHash = require('./webpack-git-hash');
var updateVersion = require('./updateVersion');

var entry = {
  widget: './app/widget',
  app: './app/index'
};

var jsLoaders = ['babel'];

if (process.env.DEVELOPMENT) {
  entry.server = [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server'
  ];
  jsLoaders.unshift(
    'react-hot'
  );
}

var plugins = process.env.DEVELOPMENT ?
  [new webpack.HotModuleReplacementPlugin()] :
  [new WebpackGitHash({
    cleanup: true,
    callback:
  })];

module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: '/static/',
    filename: '[name].[githash].js'
  },
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
