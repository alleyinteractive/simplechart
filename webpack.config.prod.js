const path = require('path');
const webpack = require('webpack');
const WebpackGitHash = require('webpack-git-hash');
const updateVersion = require('./updateVersion');

// If hash is passed from command line, e.g. $ npm run build abcd123
const hashProvided = 5 <= process.argv.length &&
  /^[a-z0-9]+$/.test(process.argv[4]);

const plugins = [
  new WebpackGitHash({
    cleanup: true,
    callback: updateVersion,
    skipHash: hashProvided ? process.argv[4] : undefined,
  }),
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
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks(module) {
      const context = module.context;
      return context && 0 <= context.indexOf('node_modules');
    },
  }),
];

module.exports = {
  devtool: 'cheap-source-map',
  entry: {
    widget: [
      path.resolve('./app/widget'),
    ],
    app: [
      path.resolve('./app/index'),
    ],
  },
  output: {
    path: path.join(__dirname, 'static'),
    publicPath: '',
    filename: '[name].[githash].js',
    chunkFilename: '[id].[githash].chunk.js',
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
