const path = require('path');
const webpack = require('webpack');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssCustomProps = require('postcss-custom-properties');
const autoprefixer = require('autoprefixer');
const postcssCalc = require('postcss-calc');
const postcssColorFunction = require('postcss-color-function');
const postcssMixins = require('postcss-mixins');
const stylelint = require('stylelint');
const WebpackGitHash = require('webpack-git-hash');
const updateVersion = require('./updateVersion');
const isDevelopment = 'development' === process.env.NODE_ENV;

/**
 * Set up entry points
 */
const entry = { widget: [path.resolve('./app/widget')] };
// Don't compile app if we're using the mock API for widget testing
if (!process.env.MOCKAPI) {
  entry.app = [path.resolve('./app/index')];
  if (isDevelopment) {
    entry.app.unshift('react-hot-loader/patch');
    entry.app.unshift('webpack/hot/only-dev-server');
    entry.app.unshift('webpack-dev-server/client?http://localhost:8080');
  }
}

const jsLoaders = ['babel'];

/**
 * Set up plugins
 */
const gitHashOpts = {
  cleanup: true,
  callback: updateVersion,
};
// If hash is passed from command line, e.g. $ npm run build abcd123
if (5 <= process.argv.length && /^[a-z0-9]+$/.test(process.argv[4])) {
  gitHashOpts.skipHash = process.argv[4];
}

let plugins = [
  new WebpackGitHash(gitHashOpts),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
  new webpack.optimize.UglifyJsPlugin(),
];

if (isDevelopment) {
  plugins = [new webpack.HotModuleReplacementPlugin()];
}

/**
 * Export the full Webpack config, note that publicPath is set in app/widget entry points
 * per https://webpack.github.io/docs/configuration.html#output-publicpath
 */
module.exports = {
  devtool: 'source-map',
  entry,
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: isDevelopment ? 'http://localhost:8080/static/' : null,
    filename: isDevelopment || process.env.JEKYLL ? '[name].js' : '[name].[githash].js',
    chunkFilename: isDevelopment || process.env.JEKYLL ? '[id].chunk.js' : '[id].[githash].chunk.js',
    jsonpFunction: 'simplechartJsonp',
  },
  plugins,
  postcss(bundler) {
    return [
      postcssImport({
        addDependencyTo: bundler,
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
        loader: 'html!markdown',
      },
    ],
  },
};
