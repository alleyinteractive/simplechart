var path = require('path');
var webpack = require('webpack');
var postcssImport = require('postcss-import');
var postcssNested = require('postcss-nested');
var postcssCustomProps = require('postcss-custom-properties');
var autoprefixer = require('autoprefixer');
var postcssCalc = require('postcss-calc');
var postcssColorFunction = require('postcss-color-function');
var postcssMixins = require('postcss-mixins');
var stylelint = require('stylelint');
var WebpackGitHash = require('webpack-git-hash');
var updateVersion = require('./updateVersion');
var isDevelopment = 'development' === process.env.NODE_ENV;

/**
 * Set up entry points
 */
var entry = { widget: [path.resolve('./app/widget')] };
// Don't compile app if we're using the mock API for widget testing
if (!process.env.MOCKAPI) {
  entry.app = [path.resolve('./app/index')];
  if (isDevelopment) {
    entry.app.unshift('react-hot-loader/patch');
    entry.app.unshift('webpack/hot/only-dev-server');
    entry.app.unshift('webpack-dev-server/client?http://localhost:8080');
  }
}

var jsLoaders = ['babel'];

/**
 * Set up plugins
 */
var gitHashOpts = {
  cleanup: true,
  callback: updateVersion
};
// If hash is passed from command line, e.g. $ npm run build abcd123
if (process.argv.length >= 5 && /^[a-z0-9]+$/.test(process.argv[4])) {
  gitHashOpts.skipHash = process.argv[4];
}

var plugins = isDevelopment ?
  [new webpack.HotModuleReplacementPlugin()] :
  [new WebpackGitHash(gitHashOpts)];

/**
 * Export the full Webpack config, note that publicPath is set in app/widget entry points
 * per https://webpack.github.io/docs/configuration.html#output-publicpath
 */
module.exports = {
  devtool: 'source-map',
  entry: entry,
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: isDevelopment ? 'http://localhost:8080/static/' : null,
    filename: isDevelopment || process.env.JEKYLL ? '[name].js' : '[name].[githash].js',
    chunkFilename: isDevelopment || process.env.JEKYLL ? '[id].chunk.js' : '[id].[githash].chunk.js',
    jsonpFunction: 'simplechartJsonp'
  },
  plugins: plugins,
  postcss: function(webpack) {
    return [
      postcssImport({
        addDependencyTo: webpack,
      }),
      postcssMixins,
      postcssNested,
      postcssCustomProps,
      autoprefixer,
      postcssCalc,
      postcssColorFunction,
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
      },
      {
        test: /\.md$/,
        loader: 'html!markdown'
      }
   ]
  }
};
