const path = require('path');
const webpack = require('webpack');
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
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
  }),
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
    publicPath: isDevelopment ? 'http://localhost:8080/static/' : '',
    filename: isDevelopment || process.env.JEKYLL ? '[name].js' : '[name].[githash].js',
    chunkFilename: isDevelopment || process.env.JEKYLL ? '[id].chunk.js' : '[id].[githash].chunk.js',
    jsonpFunction: 'simplechartJsonp',
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.js$/,
        include: path.join(__dirname, 'app'),
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 25000,
            },
          },
        ],
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
          },
        ],
      },
    ],
  },
};
